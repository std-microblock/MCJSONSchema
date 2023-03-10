export const flat = (arr)=>{
	if(Object.prototype.toString.call(arr) != "[object Array]"){return false};
	const res: any[]=[];
    arr.map(item=>{
        if(item instanceof Array)
            res.push(...item);
        else
            res.push(item)
    });
    return res;
};
