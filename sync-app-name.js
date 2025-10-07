import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前文件路径和目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const displayName = packageJson.displayName;

// 读取并更新 strings.xml
const stringsXmlPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
let stringsXml = fs.readFileSync(stringsXmlPath, 'utf8');

// 替换 app_name 和 title_activity_main 的值
stringsXml = stringsXml.replace(/<string name="app_name">[^<]*<\/string>/, `<string name="app_name">${displayName}</string>`);
stringsXml = stringsXml.replace(/<string name="title_activity_main">[^<]*<\/string>/, `<string name="title_activity_main">${displayName}</string>`);

// 保存更新后的文件
fs.writeFileSync(stringsXmlPath, stringsXml, 'utf8');

console.log(`已同步应用名称为: ${displayName}`);