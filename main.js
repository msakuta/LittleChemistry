'use strict';

const container = document.getElementById('container');
const palette = document.getElementById('palette');

const h2Elem = document.getElementById('h2');
const o2Elem = document.getElementById('o2');
const cElem = document.getElementById('c');
let h2oElem = null;
let co2Elem = null;
let ch4Elem = null;

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

function contains(array, item){
    for(let i = 0; i < array.length; i++){
        if(array[i] === item){
            return true;
        }
    }
    return false;
}

document.body.addEventListener("mouseup", evt => {
    const rect = palette.getBoundingClientRect();
    if(contains(container.children, evt.target) && rect.left < evt.clientX && evt.clientX < rect.right && rect.top < evt.clientY && evt.clientY < rect.bottom){
        container.removeChild(evt.target);
        items[evt.target.getAttribute('item')] -= 1;
    }
    dragging = null;
});

function removeItems(itemsToRemove){
    outer: for(let i = 0; i < container.children.length;){
        const child = container.children[i];
        for(let item in itemsToRemove){
            if(0 < itemsToRemove[item] && child.getAttribute('item') === item){
                container.removeChild(child);
                itemsToRemove[item]--;
                items[item]--;
                continue outer;
            }
        }
        i++;
    }
}

document.getElementById("chemistry").addEventListener("click", evt => {
    let h2Count = items.h2;
    let o2Count = items.o2;
    let cCount = items.c;

    if(1 <= h2Count && 1 <= o2Count){
        if(!h2oElem){
            removeItems({h2: 1, o2: 1});
            const elem = document.createElement("span");
            elem.className = "item noselect";
            elem.id = "h2o";
            elem.setAttribute('item', 'h2o');
            const textElem = document.createElement("span");
            textElem.className = "nomouse";
            textElem.innerHTML = "H<sub>2</sub>O";
            elem.addEventListener("mousedown", startDrag);
            elem.appendChild(textElem);
            palette.appendChild(elem);
            h2oElem = elem;
        }
    }
    else if(1 <= cCount && 1 <= o2Count){
        if(!co2Elem){
            removeItems({c: 1, o2: 1});
            const elem = document.createElement("span");
            elem.className = "item noselect";
            elem.id = "co2";
            elem.setAttribute('item', 'co2');
            const textElem = document.createElement("span");
            textElem.className = "nomouse";
            textElem.innerHTML = "CO<sub>2</sub>";
            elem.addEventListener("mousedown", startDrag);
            elem.appendChild(textElem);
            palette.appendChild(elem);
            co2Elem = elem;
        }
    }
    else if(1 <= cCount && 2 <= h2Count){
        if(!ch4Elem){
            removeItems({c: 1, h2: 2});
            const elem = document.createElement("span");
            elem.className = "item noselect";
            elem.id = "ch4";
            elem.setAttribute('item', 'ch4');
            const textElem = document.createElement("span");
            textElem.className = "nomouse";
            textElem.innerHTML = "CH<sub>4</sub>";
            elem.addEventListener("mousedown", startDrag);
            elem.appendChild(textElem);
            palette.appendChild(elem);
            ch4Elem = elem;
        }
    }
});