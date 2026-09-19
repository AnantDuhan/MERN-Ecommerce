import ejs from "ejs";
import path from "path";

const MAILS_DIR = path.join(__dirname, "..", "..", "mails");

/** Render one of the EJS templates under /mails to an HTML string. */
export function renderTemplate(
  template: string,
  data: Record<string, unknown>,
): Promise<string> {
  return ejs.renderFile(path.join(MAILS_DIR, `${template}.ejs`), data);
}
