let fCreateDomElement = oElementData => {
    let oElement;

    if(oElementData.sElType) {
        oElement = document.createElement(oElementData.sElType);

        if(oElementData.sElText) {
            oElement.appendChild(document.createTextNode(oElementData.sElText));
        }
    
        if(oElementData.oElAttr) {
            for(let sAttribute in oElementData.oElAttr) {
                oElement.setAttribute(sAttribute, oElementData.oElAttr[sAttribute]);
            }
        }
    
        if(oElementData.oElEven) {
            for(let sEvent in oElementData.oElEven) {
                oElement.addEventListener(sEvent, oElementData.oElEven[sEvent]);
            }
        }
    }

    return oElement;
}

let fCalculateProductSubtotal = oProduct => oProduct.price * oProduct.units;

let fCalculateProductVAT = oProduct => oProduct.price * oProduct.units * oProduct.tax / 100;

let fCalculateProductTotal = (nSubtotal, nVAT) => nSubtotal + nVAT;

let fSetPurchaseAmount = (sSubtotalId, sVatId, sTotalId) => {
    let nSubTotal = 0;
    let nVat = 0;
    let nTotal = 0;

    for(oProduct of oProducts) {
        nSubTotal += fCalculateProductSubtotal(oProduct);
        nVat += fCalculateProductVAT(oProduct);
        nTotal += fCalculateProductTotal(fCalculateProductSubtotal(oProduct), fCalculateProductVAT(oProduct));
    }

    document.getElementById(sSubtotalId).innerHTML = nSubTotal.toFixed(2);
    document.getElementById(sVatId).innerHTML = nVat.toFixed(2);
    document.getElementById(sTotalId).innerHTML = nTotal.toFixed(2);
}

let fObtainArticleIndex = (sId) => parseInt(sId.split("-")[sId.split("-").length - 1] - 1);

let fSetProductUnits = (sId, oProducts) => oProducts[fObtainArticleIndex(sId)].units = parseInt(document.getElementById(sId).value);

let fShouldTheButtonBeEnable = (oProducts) => {
    let bUnitsDistinctFromZero = false;

    for(let oProduct of oProducts) {
        bUnitsDistinctFromZero = bUnitsDistinctFromZero || oProduct.units > 0;
    }

    return bUnitsDistinctFromZero;
}

let fEnableDisableButton = (sId, oProducts) => {
    if(fShouldTheButtonBeEnable(oProducts)) {
        document.getElementById(sId).disabled = false;
    }
    else {
        document.getElementById(sId).disabled = true;
        fSetPurchaseAmount("subtotal", "VAT", "total");
    }    
}

let fChangeEventForArticleQuantity = (event) => {
    fSetProductUnits (event.target.id, oProducts);

    fEnableDisableButton("calculate-purchase-amount", oProducts);
}

let fCreateDomArticleList = (oProducts) => {
    let oArticleList = fCreateDomElement({sElType: "ol"});
    let oArticle;
    let oArticleName;
    let oArticleQuantity;

    for(let oProduct of oProducts) {
        oArticleName = fCreateDomElement({sElType: "div", sElText: oProduct.description});
        oArticleQuantity = fCreateDomElement({
            sElType: "input", 
            oElAttr: {
                type: "number", 
                name: "art" + (oProducts.indexOf(oProduct) + 1), 
                id: "article-textbox-" + (oProducts.indexOf(oProduct) + 1), 
                min: 0, 
                max: oProduct.stock, 
                value: oProduct.units
            },
            oElEven: {
                change: fChangeEventForArticleQuantity
            }
        });
        oArticle = fCreateDomElement({sElType: "li"});
        oArticle.appendChild(oArticleName);
        oArticle.appendChild(oArticleQuantity);
        oArticleList.appendChild(oArticle);
    }

    return oArticleList;
}

window.onload = () => {
    document.getElementById("calculate-purchase-amount").insertAdjacentElement("beforebegin", fCreateDomArticleList(oProducts));
    document.getElementById("calculate-purchase-amount").addEventListener("click",() => {fSetPurchaseAmount("subtotal", "VAT", "total")});

    fEnableDisableButton("calculate-purchase-amount", oProducts);
}
