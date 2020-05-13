// TODO
// DONE import harden()
// read Walnut and convince self that it has the properties of an inspector and a notary
//
// Derived from E sample at http://www.skyhunter.com/marcs/ewalnut.html#SEC45

import harden from "@agoric/harden";
//vouching system 
//returns a private notary that offers a public inspector
//throws problem if the object being vouched is not vouchable
function makeNotary()  {
	    const nonObject = {};
	    function unvouchedException(obj) {throw(`Object not vouchable: $obj`);}
	    let vouchableObject = nonObject;
	    const inspector = harden({
		            vouch(obj) {
				                vouchableObject = nonObject;
				                try {
							                obj.startVouch();
							                if (vouchableObject === nonObject) {
										                    return unvouchedException(obj)
										                } else {
													                    const vouchedObject = vouchableObject;
													                    vouchableObject = nonObject;
													                    return vouchedObject;
													                }
							            } catch (err) {unvouchedException(obj);}
				            }
		        });
	    const notary = harden({
		            startVouch(obj) { vouchableObject = obj;},
		            getInspector()  {return inspector;}
		        });
	    return notary;
}

//create Widget Inc's notary
const widgetNotary = makeNotary();

//Order form maker
function makeOrderForm(salesPerson) {
	    const orderForm = harden({
		            // .... methods for implementing orderForm
		            startVouch() {widgetNotary.startVouch(orderForm);}
		        });
	    return orderForm;
}

//publicly available inspector object 
//(accessible through a uri posted on Widget Inc's web site)
const WidgetInspectionService = harden({
	    getInspector() {return widgetNotary.getInspector();}
});

//#### bob software #####

//scaffold for sample
function getOrderFormFromBob()  {return makeOrderForm("scaffold");}

//######### Alice's software to vouch for the order form she received from Bob #####

const untrustedOrderForm = getOrderFormFromBob();
console.log({untrustedOrderForm});
console.log(untrustedOrderForm);
const inspector = WidgetInspectionService.getInspector();
const trustedOrderForm = inspector.vouch(untrustedOrderForm);
