export const DT_BASE_URL = (process.env.NODE_ENV === 'production')
                                  ? 'http://192.168.188.7:45111/?format=JSON&cmd={cmd}&err=true&handle='
                                  : 'http://192.168.188.41:51323/?format=JSON&cmd={cmd}&err=true&handle=' ;

export const DT_HANDLE_URL = (process.env.NODE_ENV === 'production')
  ? 'http://192.168.188.7:45111/GetHandle'
  : 'http://192.168.188.41:51323/GetHandle' ;

export const DT = {
  SSCC: {
    DETAILS: 'DT8580+SSCCDET;?:L1+{nve}'
  },
  ORDER:{
    OPEN: `DT0799+ORDER:F1+40:F2+:F7+1:F30+1:T6+{order_id}:T7+0`,
    STATUS: `DT0078+DOC;?:T6+{order_id}:F810+"L1,T6,T155":F551+1`,
    POSITIONS: 'DT0799+ITEM;?:F7+1:T2+{order_id}:T3+0:F810+"L1,L10,L11,L12,L21,T12,T13,T42,T48,T5,T51,T52,T53"',
    ADD: 'DT0799+ITEM:F5++:F6+:F7+1:F20+:F32+1:L1+{position_id}:L11+1:L12+++++++7120:L13+++1:L20+{sscc}+3:T120+{user_id}',
    CLOSE: 'DT0799+END:F1+40'
  }
}
