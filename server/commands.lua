lib.addCommand('cross', {
    help = 'Change the color of your crosshair',
    params = {
        {
            name = 'color',
            type = 'string',
            help = 'Desired color of your crosshair', 
        },

    },
}, function(source, args, raw)
    TriggerClientEvent('hud:changecrosshaircolor', source, args.color)
end)

lib.addCommand('hud', {
    help = 'Toggle your HUD',
}, function(source, args, raw)
    TriggerClientEvent('hud:toggle:hud', source)
end)