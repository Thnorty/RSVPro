import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';

export async function extractTextFromEPUB(arrayBuffer: ArrayBuffer): Promise<string> {
  const zip = new JSZip();
  await zip.loadAsync(arrayBuffer);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  // 1. Find the rootfile
  const containerXml = await zip.file('META-INF/container.xml')?.async('text');
  if (!containerXml) {
    throw new Error('Invalid EPUB: missing META-INF/container.xml');
  }

  const container = parser.parse(containerXml);
  const rootfilePath = container.container?.rootfiles?.rootfile?.['@_full-path'];

  if (!rootfilePath) {
    throw new Error('Invalid EPUB: could not find rootfile path');
  }

  // 2. Read the OPF file
  const opfContent = await zip.file(rootfilePath)?.async('text');
  if (!opfContent) {
    throw new Error(`Invalid EPUB: missing OPF file at ${rootfilePath}`);
  }

  const opf = parser.parse(opfContent);
  const manifest = opf.package?.manifest?.item || [];
  const spine = opf.package?.spine?.itemref || [];

  // Create lookup for items by ID
  const manifestMap: Record<string, string> = {};
  if (Array.isArray(manifest)) {
    for (const item of manifest) {
      if (item['@_id'] && item['@_href']) {
        manifestMap[item['@_id']] = item['@_href'];
      }
    }
  } else if (manifest['@_id'] && manifest['@_href']) {
    manifestMap[manifest['@_id']] = manifest['@_href'];
  }

  // Get reading order
  const spineIds: string[] = [];
  if (Array.isArray(spine)) {
    for (const item of spine) {
      if (item['@_idref']) spineIds.push(item['@_idref']);
    }
  } else if (spine['@_idref']) {
    spineIds.push(spine['@_idref']);
  }

  // Determine base path for relative URLs
  const opfDir = rootfilePath.substring(0, rootfilePath.lastIndexOf('/') + 1);

  // 3. Read all HTML files in spine order
  let fullText = '';
  for (const id of spineIds) {
    const href = manifestMap[id];
    if (!href) continue;

    // Decode URI component because some epub generators URL encode the href
    const filePath = opfDir + decodeURIComponent(href);
    const htmlFile = zip.file(filePath);

    if (htmlFile) {
      const htmlText = await htmlFile.async('text');
      // Strip HTML tags using regex to get plain text
      const cleanText = htmlText
        .replace(/<style[^>]*>.*<\/style>/gis, '') // Remove scripts and styles
        .replace(/<script[^>]*>.*<\/script>/gis, '')
        .replace(/<[^>]+>/g, ' ') // Replace tags with space
        .replace(/\s+/g, ' ') // Remove multiple spaces
        .trim();

      fullText += cleanText + '\n\n';
    }
  }

  return fullText;
}
