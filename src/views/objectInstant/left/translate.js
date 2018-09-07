let img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAi5JREFUSIm9lz9uE0EUhz+TJUqFaeiQrwEiDSkQ7pDcUHAAUAoQEVS5QKSgRBENHACJzopEkTQoDSBxgJwAiYYiaylZ75+ZRxHv2jP7xvauEU8ayTP6ze+beZrnme2ICE2j82n0FHg/6b6UZ7c+N/W40ZgKIHxEuDNpH9pYRO3A0p3pdYO6fw62nVbTZmNhqgfD0d5gOEoGw9FeNSjitnnatmBreWMtG9byejrotXnaQCxMtRFZm/xcnxL0SlC1bcFWg9j6UFC7LHjnJP4K5Af97mOAwmhgHaBpd07iU2D9oN/dmgs2VraAysEYhRBKtaI1Vh4BtTKog69XXQnVHWuLCWiNEbX2auCscCebBqnWtL5fBd4/u/gB2LcPb28C5IU3sQFY0/p++2cX34AoSjK5767QPbKZltZAqjWt75dk8gAgukpcdZ67q171VPt+JS+Kx24uxt4K80Ip2gBY0/p+JS+Kr9wdp7kr1E/18jv2/UpedJmYn0C17cxLzbhBqjWt73eZmO/Azeh4u3fPEfqHoUEda1rf73i7twlqHbv9tMGONa3vV0YNnF4XfLXMVVOdFmJRrt8auDByCqRlX/2vNvoLRNMWRr4AGwvB57u9vuu2/I417flu74kmXfzmUu/jAHiV+7gWIgZYA7IpoIE2EIvf1ZZ3WMZYDqdj4rZ52kB0Wn1JvPrlTJKju43fu20f9K2mzUa7TxhLPPO8jf8fWOQ5In8Q+Y3IizYWfwFd23TTSiK5mAAAAABJRU5ErkJggg=="
function transformData(arr){
  let result = [];
    arr.forEach(item=>{
      if(item.nType==1){
        let obj = {};
        obj.label = item.name;
        obj.id = item.id;
        // obj.src = img;
        obj.nType = item.nType;
        obj.children = transformData(item.businessCategoryList);
        result.push(obj)
      }
    })
    return result;
}

export { transformData }