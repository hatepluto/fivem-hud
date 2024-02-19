HUD.MAIN = {

    ---@type boolean | number
    PLAYER_ACTIVE = false,
    WEAPON_ACTIVE = false,
    RADIO_ACTIVE = false,
    VOICE_LEVEL = 2,
    PLAYER_WEAPON_AMMO = 15,
    VEHICLE_MODELS = {
     "ambulance", "firetruk", "polmav", "police", "police2", "police3", "police4", "fbi", "fbi2", "policet", "policeb", "riot", "apc", "barracks", "barracks2", "barracks3", "rhino", "hydra", "lazer", "valkyrie", 
     "valkyrie2", "savage", "trailersmall2", "barrage", "chernobog", "khanjali", "menacer", "scarab", "scarab2", "scarab3", "armytanker", "avenger", "avenger2", "tula", "bombushka", "molotok", "volatol", "starling", 
     "mogul", "nokota", "strikeforce", "rogue", "cargoplane", "jet", "buzzard", "besra", "titan", "cargobob", "cargobob2", "cargobob3", "cargobob4", "akula", "hunt"
    },
    PED_MODELS = {
     "s_m_m_paramedic_01", "s_m_m_paramedic_02", "s_m_y_fireman_01", "s_m_y_pilot_01", "s_m_y_cop_01", "s_m_y_cop_02", "s_m_y_swat_01", "s_m_y_hwaycop_01", "s_m_y_marine_01", "s_m_y_marine_02", "s_m_y_marine_03", 
     "s_m_m_marine_01", "s_m_m_marine_02"
    },

    ---@type function?
    ---@param bool boolean?
    ToggleUI = function(self, bool)
     SendReactMessage('setVisible', bool);
     self.PLAYER_ACTIVE = true;
    end,
    
    ---@type function?
    Initialize = function(self)
     self:ToggleUI(true);
     self:VoiceThread();
     self:VehicleThread();
     self:DensityThread();
    end,

    ---@type function?
    Destroy = function(self)
     self:ToggleUI(false);
     self.PLAYER_ACTIVE = false;
    end,

    ---@type function?
    VoiceThread = function(self)
     CreateThread(function()
      while self.PLAYER_ACTIVE do
       local IS_TALKING = MumbleIsPlayerTalking(PlayerId());
       local SEND_DATA = {
        voiceLevel = self.VOICE_LEVEL,
        isTalking = IS_TALKING,
        radioActive = self.RADIO_ACTIVE
       };
       SendReactMessage('UpdateVoiceStatus', SEND_DATA);
       Wait(200);
      end;
     end);
    end,

    ---@type function?
    VehicleThread = function(self)
     CreateThread(function()
      while self.PLAYER_ACTIVE do
       local PLAYER = cache.ped;
        if(IsPedInAnyVehicle(PLAYER)) then
         DisplayRadar(true);
        else
         DisplayRadar(false);
        end;
        Wait(1800);
       end;
      end);
    end,

    ---@type function?
    WeaponThread = function(self, weapondata)
     if not weapondata then return end;
      CreateThread(function()
       while self.WEAPON_ACTIVE do
        if(IsPlayerFreeAiming(PlayerId())) then
         SendReactMessage('UpdateReticuleStatus', true);
        else
         SendReactMessage('UpdateReticuleStatus', false);
        end;
        local WEAPON_AMMO = GetAmmoInPedWeapon(cache.ped, weapondata.hash);
        local SEND_DATA = {
         visible = true,
         ammo = WEAPON_AMMO,
         clipammo = self.PLAYER_WEAPON_AMMO
        };
        SendReactMessage('UpdateAmmoStatus', SEND_DATA);
        Wait(200);
       end;
      end);
    end,

    ---@type function?
    DensityThread = function(self)
     CreateThread(function()
      for _, modelName in ipairs(self.VEHICLE_MODELS) do 
       SetVehicleModelIsSuppressed(GetHashKey(modelName), true)
      end
            
      for _, modelName in ipairs(self.PED_MODELS) do 
       SetVehicleModelIsSuppressed(GetHashKey(modelName), true)
      end

      while self.PLAYER_ACTIVE do 
       Wait(1250)

       local playerCoords = GetEntityCoords(cache.ped)
       ClearAreaOfCops(playerCoords.x, playerCoords.y, playerCoords.z, 400.0)

       local vehicles = GetGamePool("CVehicle")

       for i = 1, #vehicles do 
       local vehicle = vehicles[i]
       local model = GetEntityModel(vehicle)

       for _, modelName in ipairs(self.VEHICLE_MODELS) do 
        if(model == GetHashKey(modelName)) then 
         SetEntityAsMissionEntity(vehicle, true, true)
         DeleteVehicle(vehicle)
         break
        end
       end

       local peds = GetGamePool("CPed")
        for i = 1, #peds do 
         local ped = peds[i]
         local model = GetEntityModel(ped)

         for _, modelName in ipars(self.PED_MODELS) do
          if model == GetHashKey(modelName) then 
           SetEntityAsMissionEntity(ped, true, true)
           DeletePed(ped)
           break
          end
         end

         SetPedDensityMultiplierThisFrame(1.0)
         SetScenarioPedDensityMultiplierThisFrame(1.0, 1.0)
         SetVehicleDensityMultiplierThisFrame(1.0)
         SetRandomVehicleDensityMultiplierThisFrame(1.0)
         SetParkedVehicleDensityMultiplierThisFrame(1.0)
         SetScenarioTypeEnabled("DRIVE", true)
         SetScenarioTypeEnabled("WALK", true)
         end
        end
       end
      end)
    end,

    ---@type function?
    DestroyAmmoUI = function(self)
     local SEND_DATA = {
      visible = false
     };
     SendReactMessage('UpdateAmmoStatus', SEND_DATA);
    end,

    ---@type function?
    UpdateStatusThread = function(self, data)
     if not data then return end;
     local PLAYER_HEALTH = GetEntityHealth(cache.ped) - 100;
     local PLAYER_ARMOR = GetPedArmour(cache.ped);
     local SEND_DATA = {
      visible = true,
      health = PLAYER_HEALTH,
      armor = PLAYER_ARMOR,
      hunger = data.hunger,
      thirst = data.thirst
     };
     SendReactMessage('UpdatePlayerStatus', SEND_DATA);
    end,

    ---@type function?
    FlashUIData = function(self)
     SendReactMessage('FlashUIData', true);
    end
    
};

AddEventHandler("pma-voice:radioActive", function(radioTalking)
 HUD.MAIN.RADIO_ACTIVE = radioTalking;
end);

AddEventHandler('pma-voice:setTalkingMode', function(newTalkingRange) 
 HUD.MAIN.VOICE_LEVEL = newTalkingRange;
end);

RegisterNetEvent('hud:manageweaponUI', function(weapon)
 if not weapon then HUD.MAIN.WEAPON_ACTIVE = false HUD.MAIN:DestroyAmmoUI() return end;
 if weapon then 
  HUD.MAIN.WEAPON_ACTIVE = true;
  HUD.MAIN:WeaponThread(weapon);
 end;
 local count = exports.ox_inventory:Search('count', weapon.ammo);
 HUD.MAIN.PLAYER_WEAPON_AMMO = count;
end);

RegisterNetEvent('hud:updateammocount', function(ammo)
 HUD.MAIN.PLAYER_WEAPON_AMMO = ammo;
end);

RegisterNetEvent('hud:toggle:hud', function()
 if(HUD.MAIN.PLAYER_ACTIVE) then 
  HUD.MAIN:Destroy();
 else
  HUD.MAIN:ToggleUI(true);
 end;
end);

CreateThread(function()
 lib.addKeybind({
  name = 'hud-values',
  description = "Display your hud values",
  defaultKey = "TAB",
   onPressed = function()
    if IsNuiFocused() then return end;
    HUD.MAIN:FlashUIData();
   end;
 })
end);