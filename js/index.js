//loading
let loadingRender = (function () {
    let $loadingBox = $(".loadingBox");
    let $current = $loadingBox.find(".current");
    let imgData = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];
    let n = 0;
    let len = imgData.length;
    //进度条加载动画与照片加载量绑定
    let run = function run(callback) {
        imgData.forEach(item => {
            let tempImg = new Image;
            tempImg.onload = () => {
                tempImg = null;
                $current.css("width", ++n / len * 100 + "%");
                if (n === len) {
                    clearTimeout(delayTimer);
                    callback && callback();
                }
            };
            tempImg.src = item;
        });
    };
    let delayTimer = null;
    //最大延期,当图片在规定条件下加载不完时,做成错误提示等!
    let maxDelay = function maxDelay(callback) {
        delayTimer = setTimeout(() => {
            if (n / len >= 0.9) {
                $current.css("width", "100%");
                callback && callback();
                return;
            }
            alert("网络不佳,稍后重试");
            window.location.href = "http://www.baidu.com";
        }, 10000);
    }
    //done完成 停留一秒再移除,进入下一个环节.对客户视觉的效果好.
    let done = function () {
        let timer = setTimeout(() => {
            $loadingBox.remove();
            clearTimeout(timer);

            phoneRender.init();
        }, 1000);
    }
    return {
        init: function () {
            $loadingBox.css('display','block');
            run(done);
            maxDelay(done);
        }
    }
})();
//phone
let phoneRender = (function () {
    let $phoneBox = $('.phoneBox'),
        $time = $phoneBox.find('span'),
        $answer = $phoneBox.find('.answer'),
        $answerMarkLink = $answer.find('.markLink'),
        $hang = $phoneBox.find('.hang'),
        $hangMarkLink = $hang.find('.markLink'),
        answerBell = $('#answerBell')[0],
        introduction = $('#introduction')[0];

    //=>点击ANSWER-MARK
    let answerMarkTouch = function answerMarkTouch() {
        //1.REMOVE ANSWER
        $answer.remove();
        answerBell.pause();
        $(answerBell).remove();
        //2.SHOW HANG
        $hang.css('transform', 'translateY(0rem)');
        $time.css('display', 'block');
        introduction.play();
        computedTime();
    };
    //计算播放时间
    let autoTimer = null;
    let computedTime = function computedTime() {
        autoTimer = setInterval(() => {
            let val = introduction.currentTime,
                duration = introduction.duration;
            //判断播放完成
            if (val >= duration) {
                clearInterval(autoTimer);
                closePhone();
                return;
            }
            let minute = Math.floor(val / 60),
                second = Math.floor(val - minute * 60);
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            $time.html(`${minute}:${second}`);
        }, 1000);
    };
    let closePhone = function closePhone() {
        clearInterval(autoTimer);
        introduction.pause();
        $(introduction).remove();
        $phoneBox.remove();

        messageRender.init();
    }

    return {
        init: function () {
            $phoneBox.css('display', 'block');
            //播放铃音Bell
            answerBell.play();
            answerBell.volume = 0.3;

            $answerMarkLink.tap(answerMarkTouch);
            $hangMarkLink.tap(closePhone);

        }
    }
})();

//message
let messageRender = (function () {
    let $messageBox = $('.messageBox'),
        $wrapper = $messageBox.find('.wrapper'),
        $messageList = $wrapper.find('li'),
        $keyBoard = $messageBox.find('.keyBoard'),
        $textInp = $keyBoard.find('span'),
        $submit = $keyBoard.find('.submit'),
        demonMusic = $('#demonMusic')[0];
    let step = -1,
        total = $messageList.length + 1,
        autoTimer = null,
        interval = 1500;
    let tt = 0;
    let showMessage = function showMessage() {
        ++step;
        if (step === 2) {
            clearInterval(autoTimer);
            handleSend();
            return;
        }
        let $cur = $messageList.eq(step);
        $cur.addClass('active');
        if (step >= 3) {
            //=>展示的条数已经是四条或者四条以上了,此时我们让WRAPPER向上移动(移动的距离是新展示这一条的高度)
            let curH = $cur[0].offsetHeight;
            tt -= curH;
            $wrapper.css('transform', `translateY(${tt}px)`);
        }
        if (step >= total - 1) {
            clearInterval(autoTimer);
            closeMessage();
        }

    };
    let handleSend = function handleSend() {
        $keyBoard.css('transform', 'translateY(0rem)').one('transitionend', () => {
            let str = "好的,马上介绍",
                n = -1,
                textTimer = null;
            textTimer = setInterval(() => {
                let orginHTML = $textInp.html();
                $textInp.html(orginHTML + str[++n]);
                if (n >= str.length - 1) {
                    clearInterval(textTimer);
                    $submit.css('display', 'block');
                }
            }, 100)
        });
    };
    let handleSubmit = function handleSubmit() {
        $(`<li class="self">
                <i class="arrow"></i>
                <img src="img/zf_messageStudent.png" alt="" class="pic">
                ${$textInp.html()}
            </li>`).insertAfter($messageList.eq(1)).addClass('active');
        $messageList = $wrapper.find('li');//=>重要:把新的LI放到页面中,我们此时应该重新获取LI，让MESSAGE-LIST和页面中的LI正对应，方便后期根据索引展示对应的LI
        //=>该消失的消失
        $textInp.html('');
        $submit.css('display', 'none');
        $keyBoard.css('transform', 'translateY(3.7rem)');

        autoTimer = setInterval(showMessage, interval);
    };

    let closeMessage = function closeMessage() {
        let delayTimer = setTimeout(() => {
            demonMusic.pause();
            $(demonMusic).remove();
            $messageBox.remove();
            clearTimeout(delayTimer);

            cubeRender.init();
        }, interval);

    };

    return {
        init: function () {
            $messageBox.css('display', 'block');
            //=>加载模块立即展示一条信息,后期间隔INTERVAL在发送一条信息
            showMessage();
            autoTimer = setInterval(showMessage, interval);

            $submit.tap(handleSubmit);

            demonMusic.play();

            demonMusic.volume = 0.3;

        }
    }
})();
//cube
let cubeRender = (function () {
    let $cubeBox = $('.cubeBox'),
        $cube = $('.cube'),
        $cubeList = $cube.find('li');

    let start = function start(ev) {
        let point = ev.changedTouches[0];
        this.strX = point.clientX;
        this.strY = point.clientY;
        this.changeX = 0;
        this.changeY = 0;
    };
    let move = function move(ev) {
        let point = ev.changedTouches[0];
        this.changeX = point.clientX - this.strX;
        this.changeY = point.clientY - this.strY;
    };
    let end = function end(ev) {
        let {changeX, changeY, rotateX, rotateY} = this,
            isMove = false;
        Math.abs(changeX) > 10 || Math.abs(changeY) > 10 ? isMove = true : null;
        if (isMove) {
            rotateX = rotateX - changeY / 3;
            rotateY = rotateY + changeX / 3;
            $(this).css('transform', `scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg) `);
            this.rotateX = rotateX;
            this.rotateY = rotateY;
        }
        ['strX', 'strY', 'changeX', 'changeY'].forEach(item => this[item] = null);
    };


    return {
        init: function () {
            $cubeBox.css("display", "block");
            let cube = $cube[0];
            cube.rotateX = -35;
            cube.rotateY = 35;
            $cube.on('touchstart', start)
                .on('touchmove', move)
                .on('touchend', end);
            $cubeList.tap(function () {
                $cubeBox.css('display', 'none');
                let index = $(this).index();
                detailRender.init(index);
            });
        }
    }
})();
//detail
let detailRender = (function () {
    let $detailBox = $('.detailBox'),
        swiper = null,
        $dl = $('.page1>dl');

    let swiperInit = function swiperInit() {
        swiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            onInit: move,
            onTransitionEnd: move
        });
    };

    let move = function move(swiper) {
        let activeIn = swiper.activeIndex,
            slideAry = swiper.slides;
        if (activeIn === 0) {
            $dl.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $dl.makisu('open');
        } else {
            $dl.makisu({
                selector: 'dd',
                speed: 0
            });
            $dl.makisu('close');
        }
        slideAry.forEach((item,index)=>{
            if(activeIn===index){
                item.id=`page${index+1}`;
                return;
            }
            item.id=null;
        });
    };

    return {
        init: function (index = 0) {
            $detailBox.css('display', 'block');
            if (!swiper) {
                swiperInit();
            }
            swiper.slideTo(index, 0);
        }
    }
})();
/*$(document).on('touchstart touchmove touchend',(ev)=>{
    ev.preventDefault();
});*/
//HASH
let url = window.location.href,
    well = url.indexOf('#'),
    hash = well === -1 ? null : url.substr(well + 1);
switch (hash) {
    case 'loading':
        loadingRender.init();
        break;
    case 'phone':
        phoneRender.init();
        break;
    case 'message':
        messageRender.init();
        break;
    case 'cube':
        cubeRender.init();
        break;
    case 'detail':
        detailRender.init();
        break;
    default:
        loadingRender.init();
}