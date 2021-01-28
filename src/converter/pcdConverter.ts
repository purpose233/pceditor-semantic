import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Color, Vector3 } from 'three';
import { BaseConverter } from './baseConverter'; 
import { ConverterTree } from './converterTree';
import { ConverterPoint } from './converterPoint';
import { serializeTree } from '../common/serialize';
import { BoundingBox } from '../common/bbox';

export class PCDConverter extends BaseConverter {

  private async readLine(path: string, handler: (line: string) => void): Promise<void> {
    try {
      const input = fs.createReadStream(path, {
        encoding: 'utf-8'
      });
      const rl = readline.createInterface({
        input, crlfDelay: Infinity
      });
      // rl.on('line', (data) => {
      //   handler(data);
      // });
      // await once(rl, 'close');
      for await (const line of rl) {
        handler(line);
      }
    } catch(e) {
      console.log(e);
    }
  }

  public async readBoundingBox(path: string): Promise<BoundingBox> {
    const bbox: BoundingBox = new BoundingBox(
      new Vector3(-Infinity, -Infinity, -Infinity),
      new Vector3(Infinity, Infinity, Infinity)
    );
    await this.readLine(path, (data: string): void => {
      const words = data.split(' ');
      if (!isNaN(parseFloat(words[0]))) {
        // const vector = new Vector3(parseFloat(words[0]), parseFloat(words[2]), -parseFloat(words[1]));
        const vector = new Vector3(parseFloat(words[0]), parseFloat(words[1]), parseFloat(words[2]));
        // TODO: directly modifying bbox private attributes through get function is bad design.
        bbox.getMax().max(vector);
        bbox.getMin().min(vector);
      }
    });
    bbox.updateAttributes();
    return bbox;
  }

  public createProjectDir(dirPath: string): void {
    const projectPath = path.resolve(dirPath, '../');
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  }



  public async read(filePath: string, exportPath: string): Promise<ConverterTree> {
    this.createProjectDir(exportPath);
    let pointNumber = 0;
    let pointCount = 0;
    // console.log('aaa');
    const bbox = await this.readBoundingBox(filePath);
  
//     const ws = fs.createWriteStream(exportPath);
//     ws.setDefaultEncoding('utf-8');
//     const head =
// `# .PCD v0.7 - Point Cloud Data file format
// VERSION 0.7
// FIELDS x y z intensity
// SIZE 4 4 4 4
// TYPE F F F F
// COUNT 1 1 1 1
// WIDTH 106875
// HEIGHT 1
// VIEWPOINT 0 0 0 1 0 0 0
// POINTS 106875
// DATA ascii
// `;
//     const waiting = ws.write(head);
//     let str = '';
    await this.readLine(filePath, (data: string) => {
      const words = data.split(' ');
      if (!isNaN(parseFloat(words[0]))) {
        // const position = new Vector3(parseFloat(words[0]),
        //   parseFloat(words[2]), -parseFloat(words[1]));
        const position = new Vector3(parseFloat(words[0]),
          parseFloat(words[1]), parseFloat(words[2]));
        // const i = parseFloat(words[3]);
        const color = new Color(parseInt(words[3]),
          parseInt(words[4]), parseInt(words[5]));
        const point = new ConverterPoint(position, color);
        tree.addPoint(point);
      //   str += 
      //    `${(position.x).toPrecision(8)}`
      // + ` ${(-position.z).toPrecision(8)}`
      // + ` ${(-position.y).toPrecision(8)}`
      // + ` ${i.toPrecision(8)}\n`;
        pointCount++;
      } else {
        switch (words[0]) {
          case 'POINTS': pointNumber = parseInt(words[1]); break;
        }
      }
    });
    console.log('Read points: ' + pointCount);
    // ws.write(str);
    // return null as any;
    const tree = new ConverterTree(exportPath, bbox);
    await this.readLine(filePath, (data: string) => {
      const words = data.split(' ');
      if (!isNaN(parseFloat(words[0]))) {
        // const position = new Vector3(parseFloat(words[0]),
        //   parseFloat(words[2]), -parseFloat(words[1]));
        const position = new Vector3(parseFloat(words[0]),
          parseFloat(words[1]), parseFloat(words[2]));
        const color = new Color(parseInt(words[3]),
          parseInt(words[4]), parseInt(words[5]));
        const point = new ConverterPoint(position, color);
        tree.addPoint(point);
        pointCount++;
      } else {
        switch (words[0]) {
          case 'POINTS': pointNumber = parseInt(words[1]); break;
        }
      }
    });
    console.log('Read points: ' + pointCount);
    await serializeTree(tree);
    return tree;
  }
}
