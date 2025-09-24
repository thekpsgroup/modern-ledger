install:
	@npm run setup

dev:
	@npm run dev

build:
	@npm run build

cities:
	@npm run gen:city-pages

content:
	@npm run gen:content-plan

seo:
	@npm run seo:sitemaps && npm run seo:check

qa:
	@npm run qa:links && npm run qa:lighthouse

ship:
	@npm run build && npm run seo:sitemaps && npm run seo:check && npm run qa:links && npm run qa:lighthouse && npm run deploy:vercel