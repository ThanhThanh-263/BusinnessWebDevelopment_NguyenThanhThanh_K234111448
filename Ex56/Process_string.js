function getText() 
{
  return document.getElementById("inputText").value;
}
function setResult(text) 
{
  document.getElementById("resultText").value = text;
}
function enterData() 
{
  setResult(getText());
}
function countUppercase() {
  const text = getText();
  let count = 0;
  for (let ch of text) {
    if (ch.toUpperCase() === ch && ch.toUpperCase() !== ch.toLowerCase()) {
      count++;
    }
  }
  setResult("Uppercase count: " + count);
}
function showUppercase() 
{
  setResult(getText().toUpperCase());
}
function showLowercase() 
{
  setResult(getText().toLowerCase());
}
function countLowercase() {
  const text = getText();
  let count = 0;
  for (let ch of text) {
    if (ch.toLowerCase() === ch && ch.toUpperCase() !== ch.toLowerCase()) {
      count++;
    }
  }
  setResult("Lowercase count: " + count);
}
function outputOneWordPerLine() 
{
  const text = getText().trim();
  if (text === "") {
    setResult("");
    return;
  }
  const words = text.split(/\s+/);
  setResult(words.join("\n"));
}
function wordCount() 
{
  const text = getText().trim();
  const count = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
  setResult("Word count: " + count);
}
function printVowelsConsonants() 
{
  const text = getText();
  const vowelsBase = new Set(['a','e','i','o','u','y','ă','â','ê','ô','ơ','ư']);
  let vowels = 0;
  let consonants = 0;
  for (let ch of text) {
    if (ch.toLowerCase() === ch.toUpperCase()) continue; 
    let base = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    base = base.toLowerCase();
    let baseChar = base.charAt(0);
    if (vowelsBase.has(baseChar)) {
      vowels++;
    } else {
      consonants++;
    }
  }
  setResult("Vowels: " + vowels + "\nConsonants: " + consonants);
}
