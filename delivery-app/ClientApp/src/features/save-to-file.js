export function saveToFile(data, fileName) {
    const blob = new Blob([ JSON.stringify(data) ], { type: 'application/json;charset=utf-8', endings: 'native' });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dispatchEvent(new MouseEvent('click'));
    setTimeout(() => { URL.revokeObjectURL(a.href) }, 10);
}