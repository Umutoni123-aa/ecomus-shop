// Maps product name keywords to a specific Unsplash photo ID.
// Unsplash /photos/:id/download gives a stable, relevant image with no API key needed.
const NAME_TO_UNSPLASH = {
  // Clothing
  "ribbed knit cardigan":        "photo-1576566588028-4147f3842f27",
  "waterproof puffer jacket":    "photo-1544923246-77307dd654cb",
  "tapered chino trousers":      "photo-1624378439575-d8705ad7ae80",
  "essential graphic tee":       "photo-1521572163474-6864f9cf17ab",
  "oxford button-down shirt":    "photo-1596755094514-f87e34085b2c",
  "merino wool crewneck sweater":"photo-1620799140408-edc6dcb6d633",
  "floral wrap midi dress":      "photo-1595777457583-95e059d581b8",
  "oversized cotton hoodie":     "photo-1509631179647-0177331693ae",
  "slim fit denim jeans":        "photo-1542272604-787c3835535d",
  // Fashion accessories
  "classic white sneakers":      "photo-1542291026-7eec264c27ff",
  "polarized sunglasses":        "photo-1572635196237-14b3f281503f",
  "leather crossbody bag":       "photo-1548036328-c9fa89d128fa",
  "minimalist analog watch":     "photo-1523275335684-37898b6baf30",
  "classic leather jacket":      "photo-1551028719-00167b16eac5",
  // Electronics
  "macbook pro":                 "photo-1517336714731-489689fd1ca8",
  "samsung galaxy":              "photo-1610945415295-d9bbf067e59c",
  "sony wh-1000xm4":             "photo-1505740420928-5e560c06d30e",
  "bose quietcomfort":           "photo-1546435770-a3e736f3ef28",
  "nintendo switch":             "photo-1606144042614-b2417e99c4e3",
  "sony playstation":            "photo-1607853202273-797f1c22a38e",
  "xbox series":                 "photo-1580234811497-9df7fd2f357e",
  "dell xps":                    "photo-1593642632559-0c6d3fc62b89",
  "apple watch":                 "photo-1551816230-ef5deaed4a26",
  "logitech mx master":          "photo-1527864550417-7fd91fc51a46",
  "keychron":                    "photo-1587829741301-dc798b83add3",
  "kindle paperwhite":           "photo-1544716278-ca5e3f4abd8c",
  "gopro hero":                  "photo-1516035069371-29a1b244cc32",
  "lg c3 oled":                  "photo-1593784991095-a205069470b6",
  "dyson v15":                   "photo-1558618666-fcd25c85cd64",
  "dji mini":                    "photo-1527977966376-1c8408f9f108",
  "sonos era":                   "photo-1608043152269-423dbba4e7e1",
  "apple ipad":                  "photo-1544244015-0df4b3ffc6b0",
};

/**
 * Returns a relevant Unsplash image URL for a product.
 * Falls back to the real API image if available, then to a keyword-based Unsplash search.
 */
export function getProductImage(product, width = 400, height = 300) {
  if (product.images?.[0]?.url) return product.images[0].url;

  const nameLower = (product.name ?? "").toLowerCase();

  // Find first keyword match
  const matchedKey = Object.keys(NAME_TO_UNSPLASH).find((key) =>
    nameLower.includes(key)
  );

  if (matchedKey) {
    const photoId = NAME_TO_UNSPLASH[matchedKey];
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
  }

  // Category-based fallback
  const category = (product.category?.name ?? "").toLowerCase();
  const categoryKeywords = {
    electronics: "electronics,gadget",
    fashion: "fashion,clothing",
    clothing: "clothing,apparel",
  };
  const keyword = categoryKeywords[category] ?? "product,shopping";
  // Stable seed so the same product always gets the same fallback
  const seed = (product.id ?? "x")
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0) % 1000;

  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
