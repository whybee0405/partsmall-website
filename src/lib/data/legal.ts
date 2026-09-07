/**
 * Legal page content — Privacy Policy and Terms of Service.
 *
 * This is a drafted starting point, not a reviewed legal document. Every
 * bracketed placeholder ([...]) marks a fact this project cannot supply —
 * a registration number, an appointed person, a retention period — and
 * needs filling in before publication. See the review notes delivered
 * alongside this file for the full list of what still needs a lawyer.
 *
 * Content lives here rather than inline in the page so both pages can
 * share the same "last updated" date and company reference block, and so
 * a future update to one fact doesn't require hunting through JSX.
 */

export const LEGAL_LAST_UPDATED = '7 September 2026'

export type LegalSection = {
  id: string
  title: string
  body: string[]
}

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    title: '1. Who we are',
    body: [
      'This policy is issued by Parts-Mall Africa (Pty) Ltd ("Parts-Mall Africa", "we", "us"), registration number 2005/007249/07, VAT number 4430222457, with its head office at 50 Herman Street, R24 Business Park, Building G, Unit 1, Meadowdale, Germiston 1401, South Africa.',
      'Parts-Mall Africa is the "responsible party" under the Protection of Personal Information Act 4 of 2013 (POPIA) for the personal information this site collects. Our appointed Information Officer is [Information Officer name and role], contactable at the details in Section 13 below.',
      'This policy applies to partsmall.co.za and to information you give us by phone, WhatsApp or in person at a branch when that information is recorded in our systems. It does not apply to WhatsApp, Google Maps or any other third-party service you reach through a link on this site — those are covered by that service\'s own privacy terms.',
    ],
  },
  {
    id: 'information-we-collect',
    title: '2. Information we collect',
    body: [
      'Information you give us directly. When you submit an enquiry — general, branch, trade or distributor — we collect your name, email address, phone number, and the message you send us. Depending on the enquiry type, we may also collect your business name, your province or country, and a general indication of your monthly spend. We do not ask for or store payment card details, ID numbers or passwords anywhere on this site.',
      'Information collected automatically. We use a first-party analytics tool, built and hosted by us rather than a third-party advertising network, to understand how the site is used. This can include the pages you visit, the page that referred you here, general device and browser information, and an approximate location derived from your IP address. See Section 6 (Cookies) for how this is gated by your consent choice.',
      'Information from WhatsApp and phone calls. If you contact a branch or head office by WhatsApp or phone, that conversation is subject to WhatsApp\'s (Meta\'s) own privacy policy once it leaves this site. Where a branch keeps a record of that conversation for stock or fitment follow-up, that record is handled under this policy in the same way as a web enquiry.',
    ],
  },
  {
    id: 'how-we-use-it',
    title: '3. How we use your information',
    body: [
      'We use the information above to: respond to your enquiry and route it to the right branch or desk; confirm fitment and stock details you have asked about; open and administer a trade or distributor account where you have asked us to; understand and improve how the site performs; and meet our own legal, tax and record-keeping obligations.',
      'We do not sell your personal information, and we do not use it for automated decision-making that produces legal or similarly significant effects on you.',
    ],
  },
  {
    id: 'legal-basis',
    title: '4. Our basis for processing',
    body: [
      'We process your information on one or more of the following bases recognised by POPIA: your consent (for example, when you choose to submit an enquiry, or accept analytics cookies); the steps necessary to respond to your enquiry or pursue a trade relationship you have initiated; our legitimate business interests in operating and improving a wholesale parts distribution business, balanced against your rights; and compliance with our legal obligations.',
    ],
  },
  {
    id: 'sharing',
    title: '5. Who we share information with',
    body: [
      'Branch enquiries are shared internally with the specific branch (or head office desk, for trade and distributor enquiries) best placed to answer you. We may share information with service providers who process it on our behalf — for example, hosting and IT infrastructure providers — under terms that require them to protect it and use it only for the purpose we specify.',
      'Parts-Mall Africa is the South African sales and distribution subsidiary of Parts-Mall Corporation, headquartered in South Korea. Where necessary for group-level supply, logistics or reporting purposes, limited information may be shared with other Parts-Mall group entities. [This clause needs confirming against what actually happens operationally — see review notes.]',
      'We do not share your information with third parties for their own marketing purposes.',
    ],
  },
  {
    id: 'cross-border',
    title: '6. Cross-border transfers',
    body: [
      'This site and the systems behind it are hosted in South Africa. The only cross-border transfer we anticipate is the limited group-level sharing with Parts-Mall Corporation in South Korea described in Section 5, if and when that occurs. Any such transfer is only made where POPIA\'s conditions for cross-border transfer are met, including that the recipient is subject to a comparable level of protection or you have consented to the transfer. [Whether this sharing actually occurs, and if so what safeguard applies, needs to be confirmed — see review notes.]',
    ],
  },
  {
    id: 'cookies',
    title: '7. Cookies and similar technology',
    body: [
      'This site does not currently use third-party advertising or tracking cookies. We use two categories of storage on your device:',
      'Strictly necessary: a single cookie or local storage entry that remembers your cookie preference (accepted or rejected), so we don\'t ask you again on every visit. This is set regardless of your choice, because it is what makes your choice persist.',
      'Analytics (optional): once you accept, our first-party analytics tool may set a cookie or local storage entry to distinguish visits and measure site usage, as described in Section 2. If you reject or have not yet chosen, this does not run.',
      'You can change your choice at any time using the "Cookie preferences" link in the site footer, which reopens the consent banner.',
    ],
  },
  {
    id: 'retention',
    title: '8. How long we keep your information',
    body: [
      'We keep enquiry records for as long as reasonably necessary to handle your enquiry and any resulting trade relationship, and thereafter for [retention period to be confirmed] to meet our legal, accounting and tax obligations, after which it is deleted or anonymised. Analytics data is retained in aggregate or pseudonymised form for [retention period to be confirmed].',
    ],
  },
  {
    id: 'security',
    title: '9. How we protect your information',
    body: [
      'We take reasonable technical and organisational measures to protect the personal information we hold against loss, unauthorised access, and misuse, appropriate to the nature of the information involved. No system is completely secure, and we cannot guarantee absolute security of information transmitted to us over the internet.',
    ],
  },
  {
    id: 'your-rights',
    title: '10. Your rights',
    body: [
      'Under POPIA, you have the right to: be told what personal information of yours we hold and why; access that information; have it corrected if it is inaccurate, out of date, incomplete or misleading; request its deletion or destruction once we are no longer authorised to retain it; object to our processing of it on reasonable grounds; and withdraw any consent you have given, at any time, without affecting processing already carried out.',
      'To exercise any of these rights, contact us using the details in Section 13. We will respond within the timeframes POPIA requires. If you are not satisfied with our response, you may complain to the Information Regulator (see Section 13).',
    ],
  },
  {
    id: 'children',
    title: '11. Children\'s information',
    body: [
      'This site is directed at trade and retail customers of a vehicle parts business, not at children. We do not knowingly collect personal information from children. If you believe a child has given us personal information, contact us and we will delete it.',
    ],
  },
  {
    id: 'changes',
    title: '12. Changes to this policy',
    body: [
      `We may update this policy from time to time to reflect changes in our practices or the law. The version in effect is always the one published on this page, last updated ${LEGAL_LAST_UPDATED}.`,
    ],
  },
  {
    id: 'contact',
    title: '13. Contact us and the Information Regulator',
    body: [
      'For any question about this policy, or to exercise your rights, contact our Information Officer at [privacy contact email] or write to us at 50 Herman Street, R24 Business Park, Building G, Unit 1, Meadowdale, Germiston 1401, South Africa.',
      'If you believe we have not resolved your concern, you may lodge a complaint with South Africa\'s Information Regulator: website inforegulator.org.za, general enquiries enquiries@inforegulator.org.za, complaints POPIAComplaints@inforegulator.org.za. Current postal and physical address details are published on their website.',
    ],
  },
]

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of these terms',
    body: [
      'These terms govern your use of partsmall.co.za, operated by Parts-Mall Africa (Pty) Ltd, registration number 2005/007249/07, VAT number 4430222457 ("Parts-Mall Africa", "we", "us"). By using this site, you agree to these terms. If you do not agree, please do not use the site.',
    ],
  },
  {
    id: 'what-the-site-is',
    title: '2. What this site is — and is not',
    body: [
      'This site is an information and enquiry platform for Parts-Mall Africa\'s branch network, product catalogue and trade services. It is not an online shop: there is no checkout, no online payment, and nothing on this site constitutes an offer to sell you a specific part at a specific price.',
      'Part, fitment and vehicle coverage information is published as a guide to help you and your branch have a faster conversation. It does not replace fitment confirmation by a branch, and we do not guarantee that any part shown is in stock at any particular branch at any particular time.',
    ],
  },
  {
    id: 'acceptable-use',
    title: '3. Acceptable use',
    body: [
      'You agree to use this site only for lawful purposes, and not to: attempt to gain unauthorised access to any part of the site or its underlying systems; interfere with the site\'s operation (including by overloading it or introducing malicious code); scrape or harvest data from the site at scale without our written permission; or submit false, misleading or fraudulent information through our enquiry forms.',
    ],
  },
  {
    id: 'enquiries',
    title: '4. Enquiries and trade accounts',
    body: [
      'Submitting an enquiry through this site is a request for information or contact, not a binding order, and does not create a contract between you and Parts-Mall Africa. Any resulting trade account, credit terms, or supply arrangement is governed by a separate agreement entered into directly with the relevant branch or head office desk, not by these terms.',
      'We aim to respond to enquiries promptly but do not guarantee a specific response time.',
    ],
  },
  {
    id: 'third-party',
    title: '5. Third-party services',
    body: [
      'This site links to third-party services, including WhatsApp (operated by Meta) for branch and head office contact, and Google Maps for directions. Once you follow one of those links, your use of that service is governed by its own terms and privacy policy, not ours. We are not responsible for the content, availability or practices of those third-party services.',
    ],
  },
  {
    id: 'ip',
    title: '6. Intellectual property',
    body: [
      'The Parts-Mall name and logo are trademarks of Parts-Mall Corporation, used under licence by Parts-Mall Africa. The text, images, branch and catalogue data, and design of this site are owned by or licensed to Parts-Mall Africa and may not be copied, reproduced or distributed without our prior written permission, other than for your own personal, non-commercial reference.',
    ],
  },
  {
    id: 'disclaimers',
    title: '7. Disclaimers',
    body: [
      'This site and its content are provided "as is". To the fullest extent permitted by South African law, we disclaim all warranties, express or implied, regarding the site and the information on it, including as to accuracy, completeness, or fitness for a particular purpose. Nothing in this section limits any right you have under the Consumer Protection Act 68 of 2008 that cannot lawfully be excluded.',
    ],
  },
  {
    id: 'liability',
    title: '8. Limitation of liability',
    body: [
      'To the fullest extent permitted by law, Parts-Mall Africa will not be liable for any indirect, incidental or consequential loss arising from your use of this site, including loss arising from fitment or stock information later found to be inaccurate — the branch confirmation step described in Section 2 exists precisely to catch that before you rely on it. [This clause requires calibration against the Consumer Protection Act and the mix of consumer and trade users on this site — see review notes.]',
    ],
  },
  {
    id: 'indemnity',
    title: '9. Indemnity',
    body: [
      'You agree to indemnify Parts-Mall Africa against any claim, loss or damage arising from your breach of these terms or your misuse of the site.',
    ],
  },
  {
    id: 'governing-law',
    title: '10. Governing law',
    body: [
      'These terms are governed by the laws of the Republic of South Africa, and any dispute arising from them is subject to the non-exclusive jurisdiction of the South African courts.',
    ],
  },
  {
    id: 'changes',
    title: '11. Changes to these terms',
    body: [
      `We may update these terms from time to time. The version in effect is always the one published on this page, last updated ${LEGAL_LAST_UPDATED}.`,
    ],
  },
  {
    id: 'contact',
    title: '12. Contact us',
    body: [
      'Questions about these terms can be sent to [legal/terms contact email] or to our head office at 50 Herman Street, R24 Business Park, Building G, Unit 1, Meadowdale, Germiston 1401, South Africa.',
    ],
  },
]
