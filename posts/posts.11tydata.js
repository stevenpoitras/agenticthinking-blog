/**
 * Directory data file for all posts
 * Automatically computes permalink from filename, stripping the date prefix
 * 
 * Filename: 2025-11-01-why-i-joined-ema.md
 * Result:   /blog/why-i-joined-ema/
 */
module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      // Get the file slug (filename without extension)
      // e.g., "2025-11-01-why-i-joined-ema"
      const fileSlug = data.page.fileSlug;
      
      // Strip the date prefix (YYYY-MM-DD-)
      // Matches: 2025-11-01- or 2026-01-06-
      const slug = fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
      
      return `/blog/${slug}/`;
    }
  }
};

