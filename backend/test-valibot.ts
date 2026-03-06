import * as v from "valibot";
console.log(v.minValue.name, "exists");
console.log(Object.keys(v).filter(k => k.toLowerCase().includes('value')));
