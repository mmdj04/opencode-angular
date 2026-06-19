self.addEventListener('message', ({ data }) => {
  const result = processData(data);

  self.postMessage(result);
});

function processData<T>(data: T): T {
  return data;
}
