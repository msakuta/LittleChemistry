'use strict';

const container = document.getElementById('container');
const palette = document.getElementById('palette');

const h2Elem = document.getElementById('h2');
const o2Elem = document.getElementById('o2');
const cElem = document.getElementById('c');
let h2oElem = null;

let dragging = null;
let items = {
    h2: 0,
    o2: 0,
    c: 0
};

function startDrag(evt){
    const copyElem = document.createElement("div");
    copyElem.innerHTML = evt.target.innerHTML;
    copyElem.className = "item noselect draggable";
    copyElem.addEventListener("mousedown", evt => {
        dragging = evt.target;
    });
    container.appendChild(copyElem);
    const item = evt.target.getAttribute('item');
    copyElem.setAttribute('item', item);
    dragging = copyElem;
    const rect = dragging.getBoundingClientRect();
    dragging.style.left = `${evt.clientX - rect.width / 2}px`;
    dragging.style.top = `${evt.clientY - rect.height / 2}px`;
    items[item] += 1;
}

[h2Elem, o2Elem, cElem].forEach((elem, i) => {
    // elem.style.left = `${i * 100 + 100}px`;
    elem.addEventListener("mousedown", startDrag);
});

document.body.addEventListener("mousemove", evt => {
    if(dragging){
        const rect = dragging.getBoundingClientRect();
        dragging.style.left = `${evt.clientX - rect.width / 2}px`;
        dragging.style.top = `${evt.clientY - rect.height / 2}px`;
    }
})

document.body.addEventListener("mouseleave", evt => {
    if(dragging === document.body){
        dragging = null;
    }
});

document.body.addEventListener("mouseup", evt => {
    const rect = document.getElementById("palette").getBoundingClientRect();
    if(rect.left < evt.clientX && evt.clientX < rect.right && rect.top < evt.clientY && evt.clientY < rect.bottom){
        container.removeChild(evt.target);
        items[evt.target.getAttribute('item')] -= 1;
    }
    dragging = null;
});

document.getElementById("chemistry").addEventListener("click", evt => {
    let h2Count = items.h2;
    let o2Count = items.o2;

    if(2 <= h2Count && 2 <= o2Count){
        if(!h2oElem){
            let h2ToRemove = 2;
            let o2ToRemove = 2;
            for(let i = 0; i < container.children.length;){
                const child = container.children[i];
                if(0 < h2ToRemove && child.getAttribute('item') === 'h2'){
                    container.removeChild(child);
                    h2ToRemove--;
                    items.h2--;
                    continue;
                }
                if(0 < o2ToRemove && child.getAttribute('item') === 'o2'){
                    container.removeChild(child);
                    o2ToRemove--;
                    items.o2--;
                    continue;
                }
                i++;
            }
            const elem = document.createElement("span");
            elem.className = "item noselect";
            elem.id = "h2o";
            const textElem = document.createElement("span");
            textElem.className = "nomouse";
            textElem.innerHTML = "H2O";
            elem.addEventListener("mousedown", startDrag);
            elem.appendChild(textElem);
            palette.appendChild(elem);
            h2oElem = elem;
        }
    }
});