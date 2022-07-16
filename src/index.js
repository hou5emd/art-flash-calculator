import moment from "moment";
import 'moment/locale/ru'
document.addEventListener('DOMContentLoaded', () => {



  moment.locale('ru')
  moment().weekday(1)

  let calendarSel = false
  document.querySelector('.calendar__select.select') && (calendarSel = document.querySelector('.calendar__select.select'))

  const calendarBody = calendarSel && document.querySelector('.grid-calendar__body')
  const dayTemplate = calendarSel && calendarBody.querySelector('.item-calendar').cloneNode(true)
  const calendarModalTemplate = calendarSel && calendarBody.querySelector('.item-calendar__modal').cloneNode(true)
  const calendarHeaderTemplate = document.querySelector('.header-calendar__item').cloneNode(true)
  const calendarHeaderBody = document.querySelector('.header-calendar__body')
  calendarBody && (document.querySelector('.calendar__year').innerHTML = `${moment().format('YYYY')}`)

  function setCalendarData(month) {
    calendarSel && (calendarBody.innerHTML = "")
    calendarHeaderBody.innerHTML = ''
    const monthDays = moment(`${month}`, 'M').startOf('month')
    let dayCount = 35
    let day = monthDays.day(1)

    fetch(`https://artflashmagazine.ru/wp-json/calendar/acticity/${moment(`${month}`, 'MM').format('MMYYYY')}`)
      .then(r => r.json())
      .then(data => calcBody(data))

    const createDate = (dayStart, activity) => {
      const tmp = calendarSel && dayTemplate.cloneNode(true)
      const tmpModal = calendarSel && calendarModalTemplate.cloneNode(true)
      const tmpHeaderCAl = calendarHeaderTemplate.cloneNode(true)



      calendarBody && (
        dayStart.format('DDMM') == moment().format('DDMM')
        ? tmp.classList.add('item-calendar_important')
        : tmp.classList.add('item-calendar_event')
      )

      calendarSel && (tmp.querySelector('.item-calendar__data').innerHTML = day.get('date'))
      calendarSel && (tmp.querySelector('.item-calendar__event-local').innerHTML = activity.post_title)
      calendarSel && (tmpModal.querySelector('.modal-calendar__label').innerHTML = activity.post_title)
      calendarSel && (activity.thumb && tmpModal.querySelector('.modal-calendar__img>img').setAttribute('src', `${activity.thumb}`))
      calendarSel && (tmpModal.querySelector('.modal-calendar__item>p').innerHTML = `${moment(`${activity.acf.day_start}`, 'DD:MM:YYYY').format('D')} - ${moment(`${activity.acf.day_end}`, 'DD:MM:YYYY').format('D MMMM')}`)
      calendarSel && (tmpModal.querySelector('.modal-calendar__content').childNodes[5].querySelector('p').innerHTML = `${activity.acf.time_start} - ${activity.acf.time_end}`)
      calendarSel && (tmpModal.querySelector('.modal-calendar__text').innerHTML = activity.acf.desc_mini)
      calendarSel && (tmpModal.querySelector('.modal-calendar__content').childNodes[7].querySelector('p').innerHTML = activity.acf.place)

      tmpHeaderCAl.querySelector('.item-header-calendar__data_num').innerHTML = dayStart.format('D')
      tmpHeaderCAl.querySelector('.item-header-calendar__data_month').innerHTML = dayStart.format('D MMMM').split(" ")[1]
      tmpHeaderCAl.querySelector('.item-header-calendar__title').innerHTML = activity.post_title
      tmpHeaderCAl.querySelector('.item-header-calendar__time').innerHTML = `Начало: ${activity.acf.time_start}`
      tmpHeaderCAl.querySelector('.item-header-calendar__location').innerHTML = activity.acf.place



      calendarHeaderBody.appendChild(tmpHeaderCAl)
      calendarBody && (tmp.appendChild(tmpModal))
      calendarBody && (calendarBody.appendChild(tmp))
    }


    const calcBody = (data) => {

        if (day.format('D') == 2 ){
          day = monthDays.day(-6)
          dayCount += 7
        }


        for (let i = 0; i < dayCount; ){
          const dayTMP = day
          const iTMP = i
          if (data?.[0]) {

            data.forEach(activity => {

              let dayStart = moment(`${activity.acf.day_start}`, 'DD:MM:YYYY')
              const dayEnd = moment(`${activity.acf.day_end}`, 'DD:MM:YYYY')

              if (dayStart.isSame(day)) {
                if (dayStart.isSame(dayEnd)) {
                  createDate(dayStart, activity)
                  i++
                  day = day.add(1, 'day')

                } else {
                  while (dayStart.isSame(dayEnd) || dayStart.isBefore(dayEnd)) {
                    createDate(dayStart, activity)
                    day = day.add(1, 'day')

                    i++
                    dayStart = dayStart.add(1, 'day')

                  }
                }
              }
            })
          } else {
            const tmp = dayTemplate.cloneNode(true)
            calendarBody && (tmp.querySelector('.item-calendar__data').innerHTML = day.get('date'))
            calendarBody.appendChild(tmp)
            i++
            day = day.add(1, 'day')

          }

          if(day.isSame(dayTMP) && i < dayCount && iTMP == i){
            const tmp = calendarSel && dayTemplate.cloneNode(true)
            calendarBody && (tmp.querySelector('.item-calendar__data').innerHTML = day.get('date'))
            calendarBody && (calendarBody.appendChild(tmp))
            i++
            day = day.add(1, 'day')


          }



        }

        const cardsCalendar = calendarBody && calendarBody.querySelectorAll('.item-calendar')

      calendarBody && (cardsCalendar.forEach(item => {
          if(item.childNodes?.[5]) {

            const modalWrap = item.childNodes[5]

            // item.offsetLeft < item.parentNode.clientWidth / 2 && (modalWrap.style.right = `${modalWrap.style.right - modalWrap.offsetWidth + item.offsetLeft}px`)
            // modalWrap.getBoundingClientRect().left < 0 && (modalWrap.style.left = `${-modalWrap.getBoundingClientRect().left + modalWrap.getBoundingClientRect().width}px`)
            //
            // modalWrap.getBoundingClientRect().right < 0 && (modalWrap.style.right = `${-modalWrap.getBoundingClientRect().left + modalWrap.getBoundingClientRect().width}px`)
            modalWrap.getBoundingClientRect().left < 0 && (modalWrap.style.left = `${-item.getBoundingClientRect().left}px`)
            modalWrap.getBoundingClientRect().right < 0 && (modalWrap.style.right = `${-item.getBoundingClientRect().right}px`)

            item.addEventListener('click', (e) => {
              const {target} = e
              const modalClose = item.childNodes[5].querySelector('.modal-calendar__close-btn')

              target.innerHTML !== modalClose.innerHTML && item.childNodes[5].classList.add('_active')
              target.innerHTML == modalClose.innerHTML && item.childNodes[5].classList.remove('_active')
              target.parentNode.innerHTML == modalClose.innerHTML && item.childNodes[5].classList.remove('_active')


            })

          }
        }))

    }




  }




  calendarSel && (calendarSel.value = moment().format("M"))
  console.log(calendarSel.value)
  const callSelChange = new Event("change", {"bubbles":true, "cancelable":false});
  calendarSel.addEventListener("change", ()=>{
    console.log("change")
  })
  calendarSel && (calendarSel.dispatchEvent(callSelChange))
  setCalendarData(moment().format("MM"))


  calendarSel && (document.addEventListener('selectCallback', ({detail}) => {
    setCalendarData(detail.select.value)
  }))




})