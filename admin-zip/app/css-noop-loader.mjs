export async function load(url, context, nextLoad) {
  if (/\.css(\?.*)?$/.test(url) && url.includes('/node_modules/')) {
    return { format: 'module', shortCircuit: true, source: '' }
  }
  return nextLoad(url, context)
}
