import Home from "./pages/home";
import Configuracoes from "./pages/configuracoes";
import Usuario from "./pages/usuario";
import UsuarioForm from "./pages/usuario-form";
import MeuPerfil from "./pages/meu-perfil";
import ManualDeReferencia from "./pages/manualDeReferencia";
import ManualDeReferenciaForm from "./pages/manualDeReferencia-form";
import ManualDeReferenciaItemForm from "./pages/manual-de-referencia-item-form";

const routes = [
  {
    path: "/manualdereferencia/:id/item/:iditem",
    exact: true,
    main: ManualDeReferenciaItemForm,
  },
  {
    path: "/manualdereferencia/:id/item/",
    exact: true,
    main: ManualDeReferenciaItemForm,
  },
  {
    path: "/manualdereferencia/:id/edit",
    exact: true,
    main: ManualDeReferenciaForm,
  },
  {
    path: "/manualdereferencia/cadastro",
    exact: true,
    main: ManualDeReferenciaForm,
  },
  {
    path: "/manualdereferencia",
    exact: true,
    main: ManualDeReferencia,
  },
  {
    path: "/usuario/:id/edit",
    exact: true,
    main: UsuarioForm,
  },
  {
    path: "/usuario/cadastro",
    exact: true,
    main: UsuarioForm,
  },
  {
    path: "/usuario",
    exact: true,
    main: Usuario,
  },
  {
    path: "/meuperfil",
    exact: true,
    main: MeuPerfil,
  },
  // {
  //   path: "/configuracoes",
  //   main: Configuracoes,
  // },
];

export default routes;
