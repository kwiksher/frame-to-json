interface ProcessedNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  children?: ProcessedNode[];
  style?: object;
  x?:number;
  y?:number;
  absoluteBoundingBox?:object;
  exportSettings?:object;
}

function processNode(node:SceneNode, exportedNodes:Array<object>): ProcessedNode {
  const baseNode: ProcessedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
  };

  if ("fills" in node) {
    baseNode.style = {
      fills: node.fills,
    };
  }

  if ("strokes" in node) {
    if (!baseNode.style) baseNode.style = {};
    const geometryNode = node as GeometryMixin;
    baseNode.style = {
      ...baseNode.style,
      strokes: geometryNode.strokes,
      strokeWeight: geometryNode.strokeWeight,
      strokeMiterLimit: geometryNode.strokeMiterLimit,
      strokeCap: geometryNode.strokeCap,
      strokeJoin: geometryNode.strokeJoin,
    };
  }

  if ("cornerRadius" in node) {
    if (!baseNode.style) baseNode.style = {};
    baseNode.style = {
      ...baseNode.style,
      cornerRadius: node.cornerRadius,
    };
  }

  if ("blendMode" in node) {
    if (!baseNode.style) baseNode.style = {};
    baseNode.style = {
      ...baseNode.style,
      blendMode: node.blendMode,
      opacity: node.opacity,
    };
  }

  if ("effects" in node) {
    if (!baseNode.style) baseNode.style = {};
    baseNode.style = {
      ...baseNode.style,
      effects: node.effects,
    };
  }

  if (node.type === "TEXT") {
    if (!baseNode.style) baseNode.style = {};
    baseNode.style = {
      ...baseNode.style,
      fontSize: node.fontSize,
      fontFamily: node.fontName,
      fontWeight: node.fontWeight,
      textAlignHorizontal: node.textAlignHorizontal,
      textAlignVertical: node.textAlignVertical,
      letterSpacing: node.letterSpacing,
      lineHeight: node.lineHeight,
      textDecoration: node.textDecoration,
      textCase: node.textCase,
      textAutoResize: node.textAutoResize,
      paragraphIndent: node.paragraphIndent,
      paragraphSpacing: node.paragraphSpacing,
      autoRename: node.autoRename,
    };
  }

  //add by nyamamoto
  baseNode.style = {
    ...baseNode.style,
    x: node.x,
    y: node.y,
    absoluteBoundingBox:node.absoluteBoundingBox
  }

  if ("exportSettings" in node ){
    baseNode.style = {
      ...baseNode.style,
      exportSettings:node.exportSettings
    }
    if (node.exportSettings.length > 0 ){
      exportedNodes.push({
          id: node.id,
          name: node.name,
          type: node.type,
          visible: node.visible,
          x: node.x,
          y: node.y,
          absoluteBoundingBox:node.absoluteBoundingBox,
          exportSettings:node.exportSettings
        }
      );
    }
  }

  if ("children" in node) {
    baseNode.children = (node as any).children.map((child: SceneNode) => processNode(child, exportedNodes));
  }

  return baseNode;
}

// This plugin will export JSON data from a specific frame in Figma, including its structure and styles.

figma.showUI(__html__, { width: 400, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {

    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne((node) => node.type === "FRAME" && node.name === frameName);

    if (!frame) {
      figma.ui.postMessage({ type: "error", message: `Frame not found with name "${frameName}".` });
      return;
    }

    const exportedNodes:Array<object> = [];
    const processedFrame = processNode(frame, exportedNodes);
    // const jsonData = JSON.stringify(processedFrame, null, 2);
    const jsonData = JSON.stringify(exportedNodes);
    figma.ui.postMessage({ type: "json-data", jsonData: jsonData, frameName: frameName }); // Send the frameName along with jsonData
  }
};