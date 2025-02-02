import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

export function loadSpreadsheet(
  spreadsheetId: string,
  auth: JWT,
): GoogleSpreadsheet {
  const spreadsheet = new GoogleSpreadsheet(spreadsheetId, auth);

  return spreadsheet;
}
