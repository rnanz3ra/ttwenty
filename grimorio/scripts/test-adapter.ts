import { getAvailableRaces, getRaceDetails } from '@/core/lib/rules/adapter';

console.log('--- Available Races ---');
const races = getAvailableRaces();
console.table(races);

console.log('\n--- Details for Dwarf ---');
console.log(JSON.stringify(getRaceDetails('dwarf'), null, 2));

console.log('\n--- Details for Human ---');
console.log(JSON.stringify(getRaceDetails('human'), null, 2));

console.log('\n--- Details for Qareen ---');
console.log(JSON.stringify(getRaceDetails('qareen'), null, 2));
