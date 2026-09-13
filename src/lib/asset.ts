/** Путь к файлу из public/ с учётом базового пути сборки (GitHub Pages отдаёт сайт из подпапки) */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
export const asset = (path: string) => (path.startsWith('/') ? BASE + path : path)
