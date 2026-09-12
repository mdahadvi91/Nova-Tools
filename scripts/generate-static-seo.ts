import fs from 'fs';
import path from 'path';
import { generateSitemapXml, generateRobotsTxt } from '../src/lib/sitemapGenerator';

const siteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://nova-tools-hr.vercel.app';

console.log(`Generating sitemap.xml and robots.txt for: ${siteUrl}`);

const sitemap = generateSitemapXml(siteUrl);
const robots = generateRobotsTxt(siteUrl);

const publicDir = path.join(process.cwd(), 'public');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf-8');

console.log('Successfully generated public/sitemap.xml and public/robots.txt');
