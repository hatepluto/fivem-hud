local file = ('imports/%s.lua'):format(IsDuplicityVersion() and 'server' or 'client')
local import = LoadResourceFile('ox_core', file)
local chunk = assert(load(import, ('@@ox_core/%s'):format(file)))
chunk()

if player then
    PlayerLoaded = true
end

AddEventHandler('playerSpawned', function()
    PlayerLoaded = true
    HUD.MAIN:Initialize()
end)

RegisterNetEvent('ox:playerLogout', function()
    PlayerLoaded = false
    HUD.MAIN:Destroy()
end)

AddEventHandler('ox:statusTick', function(values)
    HUD.MAIN:UpdateStatusThread(values)
end)

RegisterCommand('hudinit', function()
    PlayerLoaded = true
    HUD.MAIN:Initialize()
end)