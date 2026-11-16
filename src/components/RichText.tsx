import { Fragment, type ReactNode } from 'react'

/**
 * Renders a Lexical rich-text document (blog post bodies) as HTML.
 *
 * Replaces @payloadcms/richtext-lexical/react's <RichText> and produces the same markup for every
 * node the blog uses — `.payload-richtext` wrapper, `ul.list-bullet`, `li[value]`, new-tab links
 * with rel="noopener noreferrer" — so existing `.guide-body` styles apply unchanged. Images
 * (CloudIA `image` and imported Payload `upload` nodes) render as figures with an optional
 * caption; tables sit in a horizontally scrollable wrapper for phones. Unknown nodes render their
 * children, so new content never disappears silently.
 */
type UploadValue = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null }

type LexicalNode = {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  listType?: 'bullet' | 'number' | 'check'
  /** A list item's number, or an imported upload node's media document. */
  value?: number | UploadValue | string | null
  checked?: boolean
  url?: string
  target?: string | null
  fields?: { url?: string; newTab?: boolean; linkType?: string }
  // image (CloudIA) and upload (imported Payload) nodes
  src?: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  // table cells
  headerState?: number
  colSpan?: number
  rowSpan?: number
}

// Lexical text format bits.
const BOLD = 1
const ITALIC = 2
const STRIKETHROUGH = 4
const UNDERLINE = 8
const CODE = 16
const SUBSCRIPT = 32
const SUPERSCRIPT = 64

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

function renderText(node: LexicalNode, key: number): ReactNode {
  const format = Number(node.format) || 0
  let text: ReactNode = node.text ?? ''
  if (format & BOLD) text = <strong>{text}</strong>
  if (format & ITALIC) text = <em>{text}</em>
  if (format & STRIKETHROUGH) text = <span style={{ textDecoration: 'line-through' }}>{text}</span>
  if (format & UNDERLINE) text = <span style={{ textDecoration: 'underline' }}>{text}</span>
  if (format & CODE) text = <code>{text}</code>
  if (format & SUBSCRIPT) text = <sub>{text}</sub>
  if (format & SUPERSCRIPT) text = <sup>{text}</sup>
  return <Fragment key={key}>{text}</Fragment>
}

function renderNodes(nodes: LexicalNode[] | undefined): ReactNode[] {
  return (nodes ?? []).map((node, index) => renderNode(node, index))
}

function renderNode(node: LexicalNode, key: number): ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'linebreak':
      return <br key={key} />
    case 'tab':
      return <Fragment key={key}>{'\t'}</Fragment>
    case 'paragraph': {
      const children = renderNodes(node.children)
      return <p key={key}>{children.length ? children : <br />}</p>
    }
    case 'heading': {
      const Tag = (HEADINGS.has(node.tag ?? '') ? node.tag : 'h2') as 'h2'
      return <Tag key={key}>{renderNodes(node.children)}</Tag>
    }
    case 'quote':
      return <blockquote key={key}>{renderNodes(node.children)}</blockquote>
    case 'horizontalrule':
      return <hr key={key} />
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={key} className={`list-${node.listType ?? 'bullet'}`}>
          {renderNodes(node.children)}
        </Tag>
      )
    }
    case 'listitem': {
      const nested = node.children?.some((child) => child.type === 'list')
      return (
        <li
          key={key}
          className={nested ? 'nestedListItem' : ''}
          value={typeof node.value === 'number' ? node.value : undefined}
          {...(node.checked !== undefined ? { 'aria-checked': node.checked } : {})}
        >
          {renderNodes(node.children)}
        </li>
      )
    }
    case 'image':
    case 'upload': {
      const media = typeof node.value === 'object' && node.value ? (node.value as UploadValue) : null
      const src = node.src ?? media?.url ?? ''
      if (!src) return null
      const alt = node.alt ?? media?.alt ?? ''
      const width = node.width ?? media?.width ?? undefined
      const height = node.height ?? media?.height ?? undefined
      return (
        <figure key={key} className="guide-figure">
          {/* CMS media is served from /api/media on this domain; sizes come from the CMS. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
          {node.caption ? <figcaption>{node.caption}</figcaption> : null}
        </figure>
      )
    }
    case 'table':
      return (
        <div key={key} className="guide-table" role="region" aria-label="Table" tabIndex={0}>
          <table>
            <tbody>{renderNodes(node.children)}</tbody>
          </table>
        </div>
      )
    case 'tablerow':
      return <tr key={key}>{renderNodes(node.children)}</tr>
    case 'tablecell': {
      const header = Boolean(node.headerState)
      const Tag = header ? 'th' : 'td'
      // A cell holds paragraphs; render their content inline so cells stay compact.
      const content = (node.children ?? []).map((child, index) =>
        child.type === 'paragraph' ? (
          <Fragment key={index}>
            {index > 0 && <br />}
            {renderNodes(child.children)}
          </Fragment>
        ) : (
          renderNode(child, index)
        ),
      )
      return (
        <Tag
          key={key}
          {...(header ? { scope: (node.headerState ?? 0) & 2 ? 'row' : 'col' } : {})}
          colSpan={node.colSpan && node.colSpan > 1 ? node.colSpan : undefined}
          rowSpan={node.rowSpan && node.rowSpan > 1 ? node.rowSpan : undefined}
        >
          {content}
        </Tag>
      )
    }
    case 'link':
    case 'autolink': {
      const url = node.fields?.url ?? node.url ?? '#'
      const newTab = Boolean(node.fields?.newTab ?? node.target === '_blank')
      return (
        <a
          key={key}
          href={url}
          {...(newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        >
          {renderNodes(node.children)}
        </a>
      )
    }
    default:
      return <Fragment key={key}>{renderNodes(node.children)}</Fragment>
  }
}

export function RichText({ data }: { data: unknown }) {
  const root = (data as { root?: LexicalNode } | null)?.root
  if (!root) return null
  return <div className="payload-richtext">{renderNodes(root.children)}</div>
}
