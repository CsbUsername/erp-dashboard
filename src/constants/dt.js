export const DT_BASE_URL = (process.env.NODE_ENV === 'production')
                                  ? 'http://192.168.188.41:45111/?format=JSON&cmd={cmd}&err=true&handle='
                                  : 'http://192.168.188.41:51323/?format=JSON&cmd={cmd}&err=true&handle=' ;

export const DT_HANDLE_URL = (process.env.NODE_ENV === 'production')
  ? 'http://192.168.188.41:45111/GetHandle'
  : 'http://192.168.188.41:51323/GetHandle' ;

export const DT = {
  SSCC: {
    DETAILS: 'DT8580+SSCCDET;?:L1+{nve}',
    CREATE: 'DT8580+SSCCNEW;?:L1+{index}:',
    UPDATE: 'DT8580+SSCC-WRT:F500+UPSERT:L4+{user_id}+9999:T1+{nve}:F1+1:T15+{articul}:T17+{date}:T18+{date}:T19+{msx_date}:T23+{count_box}:T24+{netto}:T25+{brutto}:T46+{lager}:T57+1:T58+{brutto}:T59+{tara}:T61+{client}:T62+{date}:T63+"{lot}":T35+"{task_id}"'
  },
  ORDER:{
    OPEN: `DT0799+ORDER:F1+40:F2+0:F7+1:F30+1:T6+{order_id}:T7+0:L1+9995:`,
    STATUS: `DT0078+DOC;?:T6+{order_id}:F810+"L1,T6,T155":F551+1`,
    POSITIONS: 'DT0077+ITEM;?:T2+{order_id}:F810+"T5,T11,T12,L2,L10"',
    ADD: 'DT0799+ITEM:F5++:F6+:F7+1:F20+:F32+1:L1+{position_id}:L11+1:L12+++++++{lager}:L13+++1:L20+{sscc}+3:T120+{user_id}',
    CLOSE: 'DT0799+END:F1+40',
    STORNO: 'DT0799+SUBSET:L2+{sscc}+++1+'
  },
  TASK: {
    CREATE: 'DT0133+PROD-ORDER:L1+{volume}:L2+1:L4+1+1:L5+{date}:L7+1:F1+0:F2+1:F6+0:F7+1:F8+0:T1+{lager}:T2+{date}:T4+{articul}:T34+0:T99+"0":L6+{lager}',
    POSTING: 'DT0133+BATCH-HEAD:F500+UPDATE:T6+{task_id}:F1+2:F2+1:F4+0:F7+1:L8+{user_id}+9999:F22+1:L5+{nve}:',
    PROC: 'DT0133+POST-PROC:L1+{task_id}:F1+1',
    CALC: 'DT0133+BATCH-CALC:L1+{task_id}',
    UPDATE: 'DT0133+BATCH-HEAD:T6+{task_id}:F1+3:F500+UPDATE',
    EXISTS_ORDERS: 'DT0133+BATCH-HEAD;?:T2+{lager}:T16+{date}:T3+{articul}:F810+"T6+,T15+,T1+,L1+"'
  },
  CTF: {
    CREATE_TASK: 'DT0133+PROD-ORDER:L1+{volume}:L2+1:L4+1+1:L5+{date}:L7+1:F1+0:F2+1:F6+0:F7+1:F8+0:T1+4302:T2+{date}:T4+{articul}:T34+0:T99+"0":L6+4302',
    FAT_SSCC: 'DT8580+SSCC-WRT:F500+UPSERT:L4+{user_id}+9999:T1+{nve}:F1+1:T15+{articul}:T17+{date}:T18+{date}:T19+{msx_date}:T23+0:T24+{netto}:T25+{brutto}:T46+{lager}:T58+{brutto}:T59+{tara}:T61+{client}:T62+{date}:T63+"{lot}":T35+"{task_id}"'
  },
  ARTICUL:{
    MAIN_INFO: 'DT0012+MAIN;?:T2+{articul}'
  },
  POSTING: {
    STORNO_WITH_NVE: 'DT0052+STORNO:L1++{rec_nr}+++{date}:L2+{nve}:',
    STORNO_WITHOUT_NVE: 'DT0052+STORNO:L1++{rec_nr}+++{date}:',
    MOVING_TO_ZERO: 'DT0052+MAIN:L1+2+1:L3++{nve}:L4++++0++++:L9++++++++1:L12++++++++0',
    RETURN_FROM_ZERO: 'DT0052+MAIN:L1+1+1:L3++{nve}:L4++++{lager}+{part}+{date}+"{lot}"+:L9++++++++1:L12++++++++0',
    MOVE_TO_LAGER_WITH_ACCOUNT: 'DT0052+MAIN:L1+2+1:L3++{nve}:L4++++{lager}+{part}+{date}+"{lot}}+:L9++++++++1:L12++++++++0',
    MOVE_TO_LAGER: 'DT0052+MAIN:L1+2+1:L3++{nve}:L4++++{lager}'

  }
}
