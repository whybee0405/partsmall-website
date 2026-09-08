import { cache } from 'react'
import { getPayloadClient } from './client'
import { PROVINCE_ORDER, type Branch } from '@/lib/data/branches'

/**
 * Live equivalents of the old static helpers in src/lib/data/branches.ts.
 * Only active branches are ever returned — a branch an admin has unpublished
 * (unchecked "active") behaves the same as a deleted one everywhere on the
 * site, without losing the record itself.
 */
export const getAllBranches = cache(async (): Promise<Branch[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'branches',
    where: { active: { equals: true } },
    sort: 'name',
    depth: 0,
    limit: 0,
  })
  return res.docs as unknown as Branch[]
})

export async function getBranch(slug: string): Promise<Branch | undefined> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'branches',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 0,
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

/** Pure — same derivation the old NETWORK constant used, now over a live-fetched array. */
export function computeNetworkStats(branches: Branch[]) {
  return {
    total: branches.length,
    southAfrica: branches.filter((b) => b.country === 'South Africa').length,
    provinces: new Set(
      branches.filter((b) => b.province !== 'Pan-Africa').map((b) => b.province),
    ).size,
    countries: new Set(branches.map((b) => b.country)).size,
    panAfrican: branches.filter((b) => b.province === 'Pan-Africa').length,
  }
}

export async function getNetworkStats() {
  return computeNetworkStats(await getAllBranches())
}
