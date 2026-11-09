# Generates the Legal Centre pages for every product in _data/products.yml:
#   /legal/<slug>/           overview
#   /legal/<slug>/privacy/   Privacy Policy
#   /legal/<slug>/terms/     Terms of Use
#   /legal/<slug>/support/   Support and contact
module RatioJuris
  class LegalPagesGenerator < Jekyll::Generator
    safe true
    priority :high

    DOCUMENTS = {
      nil       => { "layout" => "product",  "label" => "Legal" },
      "privacy" => { "layout" => "privacy",  "label" => "Privacy Policy" },
      "terms"   => { "layout" => "terms",    "label" => "Terms of Use" },
      "support" => { "layout" => "support",  "label" => "Support" },
    }.freeze

    def generate(site)
      master_date = site.config["legal_updated"].to_s

      Array(site.data["products"]).each do |product|
        slug = product.fetch("slug") { raise "A product in _data/products.yml is missing its slug" }
        updated = [master_date, product["updated"].to_s].max

        DOCUMENTS.each do |doc, meta|
          dir = ["legal", slug, doc].compact.join("/")
          page = Jekyll::PageWithoutAFile.new(site, site.source, dir, "index.html")
          page.content = ""
          page.data["layout"] = meta["layout"]
          page.data["doc"] = doc || "overview"
          page.data["eyebrow"] = meta["label"]
          page.data["title"] = doc ? "#{product['name']} #{meta['label']}" : "#{product['name']}: Legal & Support"
          page.data["description"] = product["summary"]
          page.data["product"] = product
          page.data["updated"] = updated
          site.pages << page
        end
      end
    end
  end
end
