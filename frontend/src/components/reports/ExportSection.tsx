/**
 * Interfața pentru un raport generat în sistem
 */
export interface Report {
  id: string;            // Identificator unic al raportului
  groupId: string;       // ID-ul grupei pentru care s-a generat
  groupName: string;     // Numele grupei (pentru afișare rapidă în istoric)
  type: 'note' | 'absente' | 'complet'; // Tipul de date exportate
  generatedAt: string;   // Timestamp-ul generării (ISO format)
  status: 'success' | 'pending' | 'error'; // Starea procesului de export
}

/**
 * Structura datelor care vor fi injectate în fișierul Excel
 */
export interface ExcelData {
  headers: string[];     // Capetele de tabel (ex: ["Nume", "Nota", "Data"])
  rows: any[];           // Datele propriu-zise
  timestamp: string;     // Momentul extragerii datelor din baza de date
}