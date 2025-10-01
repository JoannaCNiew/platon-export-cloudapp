// src/app/services/export.service.ts
import { Injectable } from '@angular/core';
import { FieldConfig } from '../main/field-definitions';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  // Tworzy zawartość pliku TXT na podstawie danych i konfiguracji pól
  generateTxtContent(responses: any[], fields: FieldConfig[]): string {
    const selectedFields = fields.filter(f => f.selected);
    const headers = selectedFields.map(field => field.label).join('\t');
    let fileContent = `# Koszyk TXT Magazyn Wirtualny OSDW Azymut #\n${headers}\n`;

    responses.forEach(response => {
      const row = selectedFields.map(field => {
        // Ta sama logika switch, co w Twoim main.component.ts
        switch (field.name) {
          case 'isbn': return response.resource_metadata?.isbn || '';
          case 'title': return response.resource_metadata?.title || '';
          case 'quantity': return response.location?.reduce((sum: number, loc: any) => sum + loc.quantity, 0) || 0;
          case 'poNumber': return response.po_number || '';
          case 'author': return response.resource_metadata?.author || '';
          case 'line_number': return response.number || '';
          case 'owner': return response.owner?.desc || '';
          case 'vendor': return response.vendor?.desc || '';
          case 'price': return `${response.price?.sum} ${response.price?.currency?.value}`.trim() || '';
          case 'fund': return response.fund_distribution?.[0]?.fund_code?.value || '';
          default: return '';
        }
      }).join('\t');
      fileContent += `${row}\n`;
    });
    return fileContent;
  }

  // Obsługuje pobieranie pliku
  downloadFile(content: string, fileName: string) {
    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const a = document.createElement('a');
    a.href = dataUri;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Obsługuje kopiowanie do schowka
  copyToClipboard(content: string) {
    const textArea = document.createElement('textarea');
    textArea.value = content;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}