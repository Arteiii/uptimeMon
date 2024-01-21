import { writable } from 'svelte/store';



interface Entry {
    hostname: string;
    ip: string;
}
  
export const entries: Entry[] = [];
  
export function addEntryFromLine(line: string) {
    const columns = line.split('|');
    const hostname = columns[0]?.trim() || '';
    const ipList = columns.slice(1, -2).map(ip => ip.trim());
    const lastIP = ipList[ipList.length - 1];
    entries.push({ hostname, ip: lastIP });
  
    console.log('Added entry:', { hostname, ip: lastIP });
}

  // Function to handle the user's intention to add the data
export function addAndContinue(data: Entry[]) {
    // Perform any additional logic here based on the extracted data
    console.log('User wants to add data:', data);
  
    // For demonstration purposes, let's update a store
    // You can replace this with your actual logic
    // For example, notify the main page, call an API, etc.
    // Update a store with the extracted data
    extractedDataStore.set(data);
}
  
export const extractedDataStore = writable<{ hostname: string; ip: string }[]>([]);

  
export function addEntriesFromText(text: string) {
    const lines = text.split('\n');
    lines.forEach((line) => addEntryFromLine(line));
}

export function getEntries(): { hostname: string; ip: string }[] {
    return entries;
  }
  
export function clearEntries() {
    entries.splice(0, entries.length);
}