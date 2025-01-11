export default [
  {
    method: 'GET',
    path: '/check',
    handler: 'controller.check',
  },
  {
    method: 'POST',
    path: '/trigger',
    handler: 'controller.trigger',
  }
]
