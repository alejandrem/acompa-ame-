import { C } from './colors';

// Tema para renderizar los Términos (markdown) con los colores de la app.
export const mdTerminos = {
  body: { color: C.ink, fontSize: 14.5, lineHeight: 22 },
  heading1: { fontSize: 22, fontWeight: '900', color: C.ink, marginTop: 2, marginBottom: 6, lineHeight: 28 },
  heading2: { fontSize: 16.5, fontWeight: '900', color: C.teal, marginTop: 12, marginBottom: 4, lineHeight: 24 },
  heading3: { fontSize: 14, fontWeight: '800', color: C.ink, marginTop: 10, marginBottom: 2, lineHeight: 21 },
  paragraph: { marginTop: 4, marginBottom: 6, color: C.ink },
  strong: { fontWeight: '800' },
  em: { fontStyle: 'italic' },
  bullet_list_icon: { marginLeft: 8, marginRight: 8 },
  bullet_list_content: { flex: 1 },
  ordered_list_icon: { marginLeft: 8, marginRight: 8 },
  ordered_list_content: { flex: 1 },
  list_item: { marginBottom: 4 },
  link: { color: C.teal, fontWeight: '700', textDecorationLine: 'underline' },
};
