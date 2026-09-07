/**
 * Customer reviews.
 *
 * Real, verbatim Google reviews for Parts-Mall Africa branches, currently
 * published on the group's koreanautoparts.co.za site (the same business,
 * same branch network). Nothing here is written or paraphrased — quotes,
 * names and branches are reproduced as published. `branchSlug` only points
 * at a branch page when the review names a specific, unambiguous branch;
 * reviews naming "Johannesburg CBD" are left unlinked because the group runs
 * two Johannesburg CBD branches and the review doesn't say which one.
 */

export type Review = {
  name: string
  branchLabel: string
  branchSlug?: string
  quote: string
}

export const REVIEWS_SUMMARY = {
  rating: 4.6,
  count: '1,000+',
  source: 'Google reviews',
}

export const REVIEWS: Review[] = [
  {
    name: 'Frank Zandamela',
    branchLabel: 'Boksburg',
    branchSlug: 'boksburg',
    quote: 'The service from Nicholas and Xolani has been impressive. I have never had problems with their parts.',
  },
  {
    name: 'Gerhard Lourens',
    branchLabel: 'Alberton',
    branchSlug: 'alberton',
    quote: '5-star service and prices 3x cheaper than anywhere else. Oupa was very patient and helpful — got a perfect original Ssangyong Rexton tail light for an incredible price!',
  },
  {
    name: 'Jaco Koen',
    branchLabel: 'Johannesburg CBD',
    quote: 'Thoroughly impressed! Their selection of parts is vast and the staff are knowledgeable and friendly. The quality was top-notch.',
  },
  {
    name: 'Tapiwa Ziyahlavana',
    branchLabel: 'Wynberg',
    branchSlug: 'wynberg',
    quote: "Excellent service. I'm based in Cape Town and have worked with them for almost 2 years — I don't mind the distance, I always get the right quality parts at affordable prices.",
  },
  {
    name: 'Buzz Mann',
    branchLabel: 'Randburg',
    branchSlug: 'randburg',
    quote: 'Great customer service and very good prices. They kept me up to speed and sent the quote through on WhatsApp. Definitely recommend.',
  },
  {
    name: 'Shereez Barnes',
    branchLabel: 'Johannesburg CBD',
    quote: "Service is absolutely 5-star plus! The parts are such good quality you'll mistake them for the original. They even respond instantly on their WhatsApp line.",
  },
  {
    name: 'Gerrie Van Der Walt',
    branchLabel: 'Randburg',
    branchSlug: 'randburg',
    quote: 'You guys rock! Ordered late afternoon and it was still delivered same day. Any query gets an answer and a price within minutes. Excellent service.',
  },
  {
    name: 'Fundiswa Mazibuko',
    branchLabel: 'Johannesburg CBD',
    quote: "Best service and parts at affordable prices. Big up to Angel for excellent customer service — I'm from the Eastern Cape but always order from them.",
  },
  {
    name: 'Bongane Ngema',
    branchLabel: 'Alberton',
    branchSlug: 'alberton',
    quote: 'Five-star service — from the staff to the spares. All good! Special shout-out to Sandile — ask for him by name for the best service.',
  },
]
