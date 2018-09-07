<template>
 <div class="progress">
    <div class="progress-bar  active" :class="{'progress-bar-green':percentage==100,'progress-bar-info':percentage!=100,' progress-bar-striped':percentage!=100}"  :style="{'width':percentage+'%'}">
      <div class="progress-value" v-if="percentage!=0">{{percentage}}%</div>
    </div>
  </div>
</template>
<script>
  export default {
    props:["percentage"],
    computed: {
    
    }
  };
</script>
<style>
.progress{
    height: 10px;
    background: #e6e6e6;
    overflow: visible;
    border-radius: 20px;
}
.progress .progress-bar{
    border-radius: 20px;
    position: relative;
    animation: animate-positive 2s;
}
.progress .progress-value{
    display: block;
    padding: 3px 7px;
    font-size: 13px;
    color: #fff;
    border-radius: 4px;
    background: #4588e6;
    position: absolute;
    top: -40px;
    right: -10px;
    transition: background .2s ease;
}
.progress .progress-value:after{
    content: "";
    border-top: 10px solid #4588e6;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    bottom: -6px;
    left: 26%;
    transition: all .2s ease;
}
.progress-bar.active{
    animation: reverse progress-bar-stripes 0.40s linear infinite, animate-positive 2s;
}
@-webkit-keyframes animate-positive{
    0% { width: 0; }
}
@keyframes animate-positive{
    0% { width: 0; }
}


@-webkit-keyframes progress-bar-stripes {
    from {
        background-position: 40px 0
    }
    to {
        background-position: 0 0
    }
}

@-o-keyframes progress-bar-stripes {
    from {
        background-position: 40px 0
    }
    to {
        background-position: 0 0
    }
}

@keyframes progress-bar-stripes {
    from {
        background-position: 40px 0
    }
    to {
        background-position: 0 0
    }
}
.progress-bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #337ab7;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    -webkit-transition: width .6s ease;
    -o-transition: width .6s ease;
    transition: width .6s ease;
}
.progress-striped .progress-bar, .progress-bar-striped {
    background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: -o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    -webkit-background-size: 40px 40px;
    background-size: 40px 40px;
}
.progress-bar-info {
    background-color: #4588e6;
}
.progress-bar-green {
    background-color: #9ccc66;
}
div.progress-bar-green .progress-value {
    background: #9ccc66;
}
div.progress-bar-green .progress-value:after {
    border-top: 10px solid #9ccc66;
}
</style>
