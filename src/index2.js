import moment from "moment";
import 'moment/locale/ru'
window.onload = () => {



  moment.locale('ru')
  moment().weekday(1)

  const calendarBody = document.querySelector('.grid-calendar__body')
  const dayTemplate = calendarBody.querySelector('.item-calendar').cloneNode(true)
  const calendarModalTemplate = calendarBody.querySelector('.item-calendar__modal').cloneNode(true)
  let modalsEvents


  function setCalendarData(month) {
    calendarBody.innerHTML = ""
    const monthDays = moment(`${month}`, 'M').startOf('month')
    let dayCount = 35
    let day = monthDays.day(1)
    
    fetch(`https://artflashmagazine.ru/wp-json/calendar/acticity/${moment(`${month}`, 'MM').format('MMYYYY')}`)
      .then(r => r.json())
      .then(data => calcBody(data))



    const calcBody = (data) => {

        if (day.format('D') == 2 ){
          day = monthDays.day(-6)
          dayCount += 7
        }


        for (let i = 0; i < dayCount; ){
          if (data?.[0]) {
            data.forEach(activity => {

              let dayStart = moment(`${activity.acf.day_start}`, 'DD:MM:YYYY')
              const dayEnd = moment(`${activity.acf.day_end}`, 'DD:MM:YYYY')

              if (dayStart.format('DDMM') == day.format('DDMM')) {
                if (dayStart.format('DDMM') == dayEnd.format('DDMM')) {
                  const tmp = dayTemplate.cloneNode(true)
                  const tmpModal = calendarModalTemplate.cloneNode(true)
                  tmp.querySelector('.item-calendar__data').innerHTML = day.get('date')
                  tmp.querySelector('.item-calendar__event-local').innerHTML = activity.acf.desc_mini
                  calendarBody.appendChild(tmp)
                  i++
                  day = day.add(1, 'day')
                } else {
                  while (dayStart.format('DDMM') <= dayEnd.format('DDMM')) {
                    const tmp = dayTemplate.cloneNode(true)
                    const tmpModal = calendarModalTemplate.cloneNode(true)

                    dayStart.format('DDMM') == moment().format('DDMM')
                      ? tmp.classList.add('item-calendar_important')
                      : tmp.classList.add('item-calendar_event')

                    tmp.querySelector('.item-calendar__data').innerHTML = day.get('date')
                    tmp.querySelector('.item-calendar__event-local').innerHTML = activity.acf.desc_mini
                    tmpModal.querySelector('.modal-calendar__label').innerHTML = activity.acf.desc_mini
                    tmp.appendChild(tmpModal)
                    calendarBody.appendChild(tmp)
                    day = day.add(1, 'day')
                    i++
                    dayStart = dayStart.add(1, 'day')
                  }
                }
              } else {
                const tmp = dayTemplate.cloneNode(true)
                tmp.querySelector('.item-calendar__data').innerHTML = day.get('date')
                tmp.querySelector('.item-calendar__event-local').innerHTML = 'Просто день'
                calendarBody.appendChild(tmp)
                i++
                day = day.add(1, 'day')
              }
            })
          } else {
            const tmp = dayTemplate.cloneNode(true)
            tmp.querySelector('.item-calendar__data').innerHTML = day.get('date')
            tmp.querySelector('.item-calendar__event-local').innerHTML = 'data?.[0]'
            calendarBody.appendChild(tmp)
            i++
            day = day.add(1, 'day')
          }



        }

        const cardsCalendar = calendarBody.querySelectorAll('.item-calendar')

        cardsCalendar.forEach(item => {
          item.addEventListener('click', ({target}) => {
            const modalClose = item.childNodes[5].querySelector('.modal-calendar__close-btn')

            target.innerHTML !== modalClose.innerHTML && item.childNodes[5].classList.add('_active')
            target.innerHTML == modalClose.innerHTML && item.childNodes[5].classList.remove('_active')
            target.parentNode.innerHTML == modalClose.innerHTML && item.childNodes[5].classList.remove('_active')


          })
        })

    }




  }

  document.addEventListener('selectCallback', ({detail}) => {
    setCalendarData(detail.select.value)
  })

  const calendarSel = document.querySelector('.calendar__select')
  calendarSel.value = moment().format("M")
  const callSelChange = new Event("change", {"bubbles":true, "cancelable":false});
  calendarSel.dispatchEvent(callSelChange)
  console.log(calendarSel.value)
  setCalendarData(moment().format("MM"))





}