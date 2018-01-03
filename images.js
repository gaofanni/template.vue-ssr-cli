let fs = require('fs');

let images = require('images');
let path = require('path')

let base = 40;


let option = {
    dirPath: './src/images/',
    outputPath: './src/common/sass/'
};

function DealImages(option) {
    this.dirPath = option.dirPath;
    this.outputPath = option.outputPath;
    this.timer = null;
}

DealImages.prototype.init = function() {
    this.readAllImages();
    fs.watch(this.dirPath, (eventType, filename) => {
        if (eventType) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.readAllImages();
            }, 3000);
        }
        console.log('修改了：' + filename);
    });
};

DealImages.prototype.readAllImages = function() {
    fs.readdir(this.dirPath, (err, data) => {
        if (err) {
            console.log(err);
            return false;
        }

        this.callback('writeStylesheet', data);
    });
};

DealImages.prototype.filterImages = function(data) {
    let formatAry = ['bmp', 'png', 'jpeg', 'gif']

    let newAry = [];

    data.forEach((item, index) => {
        if (item.indexOf('.') != -1) {
            let suffix = item.split('.')[1];

            if (formatAry.indexOf(suffix) != -1) { //  如果 judge 里面有 说明是图片
                newAry.push(item);
            }
        }

    });
    // console.log(newAry);
    return newAry;

};

DealImages.prototype.getSize = function(filePath) {

    let size = images(filePath);

    return {
        width: size.width(),
        height: size.height()
    }
};

DealImages.prototype.template = function(w, h, fileName, fileNameAll) {
    let width = w == 720 ? '100%' : w / base + 'rem';

    return `@mixin ${fileName}(){
  width:${width};
  height:${h/base}rem;
  background:url(../../images/${fileNameAll}) no-repeat;
  background-size:${width} ${h/base}rem;
  background-position: center;
}
`;
}

DealImages.prototype.templateWidth = function(w, fileName) {
    return `@function ${fileName}-w(){
    @return ${w/base}rem;
}
`;
}

DealImages.prototype.templateHeight = function(h, fileName) {
    return `@function ${fileName}-h(){
    @return ${h/base}rem;
}
`;
}

DealImages.prototype.writeStylesheet = function(data) {

    let imagesAry = this.filterImages(data);
    let template = ``;

    imagesAry.map((item, index) => {
        if (item.indexOf('.') != -1) {
            let fileName = item.split('.')[0];

            let filePath = this.dirPath + item;

            let size = this.getSize(filePath);

            template += this.template(size.width, size.height, fileName, item);

            template += this.templateWidth(size.width, fileName);

            template += this.templateHeight(size.height, fileName);
        }

    });

    let outputPath = this.outputPath + 'images.scss';
    //判断输出路径文件夹是否存在
    function mkdir(dirpath, dirname) {
        //判断是否是第一次调用  
        if (typeof dirname === "undefined") {
            if (fs.existsSync(dirpath)) {
                return;
            } else {
                mkdir(dirpath, path.dirname(dirpath));
            }
        } else {
            //判断第二个参数是否正常，避免调用时传入错误参数  
            if (dirname !== path.dirname(dirpath)) {
                mkdir(dirpath);
                return;
            }
            if (fs.existsSync(dirname)) {
                fs.mkdirSync(dirpath)
            } else {
                mkdir(dirname, path.dirname(dirname));
                fs.mkdirSync(dirpath);
            }
        }
    }
    mkdir(this.outputPath);
    fs.writeFile(outputPath, template, (err) => {
        if (err) {
            console.log(err);
            return err;
        }
    });
};


DealImages.prototype.callback = function(strategy, data) {
    this.strategies(strategy, data) || console.log(strategy + '您回调的策略对象不存在~');
};

DealImages.prototype.strategies = function(strategy, data) {

    if (this[strategy]) {

        this[strategy](data);

        return true;
    }

    return false;
};

let deal = new DealImages(option);
deal.init();