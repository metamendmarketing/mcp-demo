const s = '"[\\"a\\",\\"b\\"]"';
console.log('Original string:', s);
const p1 = JSON.parse(s);
console.log('Parsed once:', p1);
console.log('Type after parse 1:', typeof p1);
if (typeof p1 === 'string') {
    const p2 = JSON.parse(p1);
    console.log('Parsed twice:', p2);
    console.log('Type after parse 2:', typeof p2);
}
