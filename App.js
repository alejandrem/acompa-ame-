import React, { useCallback, useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { C } from './src/theme/colors';
import { s } from './src/styles/styles';
import { ACOMP, ACTS, dias, money } from './src/data/mockData';
import Marca from './src/components/ui/Marca';
import Splash from './src/screens/Splash';
import Acceso from './src/screens/Acceso';
import Terminos from './src/screens/Terminos';
import Inicio from './src/screens/Inicio';
import Reservar from './src/screens/Reservar';
import Agenda from './src/screens/Agenda';
import Bitacora from './src/screens/Bitacora';
import Monedero from './src/screens/Monedero';
import Seguir from './src/screens/Seguir';
import Perfil from './src/screens/Perfil';

export default function App() {
  const [fase, setFase] = useState('splash');
  const [u, setU] = useState(null);
  const [tab, setTab] = useState('inicio');
  const [res, setRes] = useState(null);
  const [mapa, setMapa] = useState(null);
  const [saldo, setSaldo] = useState(800);
  const [toast, setToast] = useState(null);
  const [facil, setFacil] = useState(false);
  const [citas, setCitas] = useState([
    {
      id: 0, a: ACOMP[3], dia: 'Lun 26 oct', k: -2, hora: '10:00', h: 4, act: ACTS[0], lugar: 'Banco', total: 480, estado: 'Completada', animo: 'Muy contenta 😊', entrega: 'con su hija a las 14:05',
      bit: [
        { h: '10:00', t: 'Pasé por ella a su casa. Salió de buen humor.' },
        { h: '10:40', t: 'Fuimos al banco a cobrar su pensión. Sin fila larga.' },
        { h: '12:15', t: 'Pasamos por un helado de vainilla 🍦 y platicamos en la plaza.' },
        { h: '13:30', t: 'Comimos con calma y tomó sus medicinas a su hora.' },
        { h: '14:05', t: 'La entregué en casa con su hija. Todo en orden.' },
      ]
    },
    { id: 1, a: ACOMP[0], dia: `${dias()[1].d} ${dias()[1].n} ${dias()[1].m}`, k: 1, hora: '10:00', h: 3, act: ACTS[1], lugar: 'Hospital Ángeles', total: 360, estado: 'Confirmada' }]);
  const [movs, setMovs] = useState([{ id: 1, c: 'Recarga inicial', f: 'Hoy', monto: 1160 }, { id: 2, c: 'Cita con Carlos Pérez', f: 'Hoy', monto: -360 }]);

  const aviso = (t, tipo = 'ok', fn) => { setToast({ t, tipo }); setTimeout(() => { setToast(null); if (fn) fn(); }, 1700); };

  const reservar = (pre, act) => setRes({ pre, act });

  const confirmar = (c) => {
    setCitas((prev) => [c, ...prev]);
    setSaldo((prev) => prev - c.total);
    setMovs((prev) => [{ id: Date.now(), c: `Cita con ${c.a.nombre}`, f: 'Hoy', monto: -c.total }, ...prev]);
    setRes(null);
    setTab('agenda');
    aviso('¡Cita confirmada!');
  };

  const cancelar = (id) => {
    const c = citas.find((x) => x.id === id);
    if (!c) return;
    setCitas((prev) => prev.map((x) => (x.id === id ? { ...x, estado: 'Cancelada' } : x)));
    setSaldo((prev) => prev + c.total);
    setMovs((prev) => [{ id: Date.now(), c: 'Reembolso por cancelación', f: 'Hoy', monto: c.total }, ...prev]);
    aviso('Cita cancelada y dinero devuelto.');
  };

  const completar = (id) => {
    const c = citas.find((x) => x.id === id);
    if (!c) return;
    const p = (n) => String(n).padStart(2, '0');
    const sh = parseInt(c.hora, 10);
    const bit = [
      { h: `${p(sh)}:00`, t: 'Llegué a su domicilio y salimos de buen humor.' },
      { h: `${p(sh)}:40`, t: `Hicimos lo planeado: ${c.act.n.toLowerCase()} en ${c.lugar}.` },
      { h: `${p(sh + 1)}:30`, t: 'Pasamos por un helado 🍦 y platicamos un rato.' },
      { h: `${p(sh + c.h)}:00`, t: 'Lo entregué en casa con su familia. Todo en orden.' },
    ];
    setCitas((prev) => prev.map((x) => (x.id === id ? { ...x, estado: 'Completada', bit, animo: 'Contento 😊', entrega: `a las ${p(sh + c.h)}:00` } : x)));
    aviso('Servicio terminado. Ya está la bitácora.');
  };

  const recargar = (m) => {
    setSaldo((prev) => prev + m);
    setMovs((prev) => [{ id: Date.now(), c: 'Recarga con tarjeta', f: 'Hoy', monto: m }, ...prev]);
    aviso(`Recargaste $${m}`);
  };

  const TABS = [{ id: 'inicio', n: 'Inicio', i: '🧭' }, { id: 'agenda', n: 'Agenda', i: '📅' }, { id: 'bitacora', n: 'Bitácora', i: '📒' }, { id: 'monedero', n: 'Monedero', i: '👛' }, { id: 'perfil', n: 'Perfil', i: '👤' }];

  const finSplash = useCallback(() => setFase('acceso'), []);
  if (fase === 'splash') return <Splash fin={finSplash} />;
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          {fase === 'acceso' ? <Acceso entrar={(x) => { setU(x); setFase('terminos'); }} />
            : fase === 'terminos' ? <Terminos onAceptar={() => setFase('app')} />
            : res ? <Reservar pre={res.pre} preAct={res.act} saldo={saldo} cerrar={() => setRes(null)} confirmar={confirmar} aviso={aviso} irMonedero={() => { setRes(null); setTab('monedero'); }} />
              : mapa ? <Seguir c={mapa} cerrar={() => setMapa(null)} />
                : <>
                  <View style={s.top}>
                    <Marca size={16} color={C.white} /><Text style={s.topN}>acompáñame</Text>
                    <TouchableOpacity onPress={() => setTab('monedero')} style={s.saldoPill}><Text style={{ color: C.ink, fontWeight: '800', fontSize: 13 }}>👛 {money(saldo)}</Text></TouchableOpacity>
                  </View>
                  {tab === 'inicio' && <Inicio u={u} citas={citas} reservar={reservar} verMapa={setMapa} facil={facil} irA={setTab} aviso={aviso} />}
                  {tab === 'agenda' && <Agenda citas={citas} cancelar={cancelar} verMapa={setMapa} reservar={reservar} />}
                  {tab === 'bitacora' && <Bitacora citas={citas} completar={completar} />}
                  {tab === 'monedero' && <Monedero saldo={saldo} movs={movs} recargar={recargar} />}
                  {tab === 'perfil' && <Perfil u={u} facil={facil} setFacil={setFacil} salir={() => { setFase('acceso'); setTab('inicio'); }} />}
                  <View style={s.nav}>
                    {TABS.map((t) => (
                      <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={[s.navI, tab === t.id && { backgroundColor: C.white }]}>
                        <Text style={{ fontSize: 18 }}>{t.i}</Text>
                        {tab === t.id && <Text style={{ fontSize: 12, fontWeight: '800', color: C.ink, marginLeft: 6 }}>{t.n}</Text>}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>}
          {toast && <View style={[s.toast, { backgroundColor: toast.tipo === 'error' ? C.red : C.ink }]}><Text style={{ color: C.white, fontWeight: '700', textAlign: 'center' }}>{toast.t}</Text></View>}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

