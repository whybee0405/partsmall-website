import { cache } from 'react'
import { getCmsClient } from './client'
import { PROVINCE_ORDER, computeNetworkStats, type Branch } from '@/lib/data/branches'

export { computeNetworkStats }

/**
 * Live equivalents of the old static helpers in src/lib/data/branches.ts.
 * Only active branches are ever returned — a branch an admin has unpublished
 * (unchecked "active") behaves the same as a deleted one everywhere on the
 * site, without losing the record itself.
 */
export const getAllBranches = cache(async (): Promise<Branch[]> => {
  const cms = getCmsClient()
  const res = await cms.find({
    collection: 'branches',
    where: { active: { equals: true } },
    sort: 'name',
    depth: 0,
    limit: 0,
  })
  return res.docs as unknown as Branch[]
})

export async function getBranch(slug: string): Promise<Branch | undefined> {
  const cms = getCmsClient()
  const res = await cms.find({
    collection: 'branches',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 1,
    limit: 1,
  })
  return res.docs[0] as unknown as Branch | undefined
}

export async function branchesByProvince() {
  const branches = await getAllBranches()
  return PROVINCE_ORDER.map((province) => ({
    province,
    branches: branches.filter((b) => b.province === province),
  })).filter((g) => g.branches.length > 0)
}

export async function getNetworkStats() {
  return computeNetworkStats(await getAllBranches())
}
