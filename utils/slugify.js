const slugify = (str) => {
    return str
        .toLowerCase()  
        .replace(/\s+/g, '-') 
        .replace(/[^\w\-]+/g, '')  
        .replace(/\-\-+/g, '-')  
        .trim('-');  
};

module.exports = slugify;
