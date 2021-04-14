function createElementDom(element, parent, ...className) {
  const node = document.createElement(element);
  if (className.length > 0) {
    node.classList.add(...className);
  }
  parent.append(node);
  return node;
}

export default createElementDom;
