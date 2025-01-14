window.addEventListener("load", function () {

    const version = '1.6'

    if (player === null) {
        runLoad("character-creation", "flex");
    } else {
        let target = document.querySelector("#title-screen");
        target.style.display = "flex";
    }

    // Title Screen Validation
    document.querySelector("#title-screen").addEventListener("click", function () {
        const player = JSON.parse(localStorage.getItem("playerData"));
        if (player.allocated) {
            enterDungeon();
        } else {
            allocationPopup();
        }
    });

    // Prevent double-click zooming on mobile devices
    document.ondblclick = function (e) {
        e.preventDefault();
    }

    // Submit Name
    document.querySelector("#name-submit").addEventListener("submit", function (e) {
        e.preventDefault();
        let playerName = document.querySelector("#name-input").value;

        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (format.test(playerName)) {
            document.querySelector("#alert").innerHTML = "你的名字包含特殊字符!";
        } else {
            if (playerName.length < 3 || playerName.length > 15) {
                document.querySelector("#alert").innerHTML = "你的名字长度应位于3-15之间!";
            } else {
                player = {
                    name: playerName,
                    lvl: 1,
                    stats: {
                        hp: null,
                        hpMax: null,
                        atk: null,
                        def: null,
                        pen: null,
                        atkSpd: null,
                        vamp: null,
                        critRate: null,
                        critDmg: null
                    },
                    baseStats: {
                        hp: 500,
                        atk: 100,
                        def: 50,
                        pen: 0,
                        atkSpd: 0.6,
                        vamp: 0,
                        critRate: 0,
                        critDmg: 50
                    },
                    equippedStats: {
                        hp: 0,
                        atk: 0,
                        def: 0,
                        pen: 0,
                        atkSpd: 0,
                        vamp: 0,
                        critRate: 0,
                        critDmg: 0,
                        hpPct: 0,
                        atkPct: 0,
                        defPct: 0,
                        penPct: 0,
                    },
                    bonusStats: {
                        hp: 0,
                        atk: 0,
                        def: 0,
                        atkSpd: 0,
                        vamp: 0,
                        critRate: 0,
                        critDmg: 0
                    },
                    exp: {
                        expCurr: 0,
                        expMax: 100,
                        expCurrLvl: 0,
                        expMaxLvl: 100,
                        lvlGained: 0
                    },
                    inventory: {
                        consumables: [],
                        equipment: []
                    },
                    equipped: [],
                    gold: 0,
                    bank: 0,
                    playtime: 0,
                    kills: 0,
                    deaths: 0,
                    dp:0,
                    ap:0,
                    sp:0,
                    dtd:0,
                    ops:0,
                    ert:0,
                    crt:0,
                    rtt:0,
                    yuj:1,
                    iop:1,
                    kll:1,
                    nmk:1,
                    vip:0,
                    rebirth:0,
                    inCombat: false
                };
                calculateStats();
                player.stats.hp = player.stats.hpMax;
                saveData();
                document.querySelector("#character-creation").style.display = "none";
                runLoad("title-screen", "flex");
            }
        }
    });

    // Unequip all items
    document.querySelector("#unequip-all").addEventListener("click", function () {
        sfxOpen.play();

        dungeon.status.exploring = false;
        let dimTarget = document.querySelector('#inventory');
        dimTarget.style.filter = "brightness(50%)";
        defaultModalElement.style.display = "flex";
        defaultModalElement.innerHTML = `
        <div class="content">
            <p>卸下所有装备s?</p>
            <div class="button-container">
                <button id="unequip-confirm">卸下</button>
                <button id="unequip-cancel">取消</button>
            </div>
        </div>`;
        let confirm = document.querySelector('#unequip-confirm');
        let cancel = document.querySelector('#unequip-cancel');
        confirm.onclick = function () {
            sfxUnequip.play();
            unequipAll();
            continueExploring();
            defaultModalElement.style.display = "none";
            defaultModalElement.innerHTML = "";
            dimTarget.style.filter = "brightness(100%)";
        };
        cancel.onclick = function () {
            sfxDecline.play();
            continueExploring();
            defaultModalElement.style.display = "none";
            defaultModalElement.innerHTML = "";
            dimTarget.style.filter = "brightness(100%)";
        };
    });

    // Opens House
    document.querySelector("#house-btn").addEventListener("click", function () {
        sfxOpen.play();
        closeInventory();
        dungeon.status.exploring = false;
        let dimDungeon = document.querySelector('#dungeon-main');
        dimDungeon.style.filter = "brightness(50%)";
        menuModalElement.style.display = "flex";

        // Menu tab
        menuModalElement.innerHTML = `
        <div class="content">
            <div class="content-head">
                <h3>建筑</h3>
                <p id="close-menu"><i class="fa fa-xmark"></i></p>
            </div>
            <button id="farm" style='color:lawngreen'><i class="fa-solid fa-wheat-awn" style="color: #63E6BE;"></i>灵田</button>
            <button id="liesha" style='color:red'><i class="fa-solid fa-crosshairs" style="color: #ff0000;"></i>猎杀榜</button>
            <button id="bank" style='color:lawngreen'><i class="fa-solid fa-building-columns"></i>钱庄</button>
            <button id="treasuree" style='color:gold'><i class="fa-regular fa-gem"></i>珍宝阁</button>
            <button id="Aclose-menu"><i class="fa-solid fa-right-from-bracket"></i>离开</button>
        </div>`;
        let close = document.querySelector('#close-menu');
        let Aclose = document.querySelector('#Aclose-menu');
        let farm = document.querySelector('#farm');
        let liesha = document.querySelector('#liesha');
        let bank = document.querySelector('#bank');
        let treasureM = document.querySelector('#treasuree');

        farm.onclick = function () {
            sfxOpen.play();
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="profile-tab">
                <div class="content-head">
                    <h3><i class="fa-solid fa-wheat-awn" style="color: #63E6BE;"></i>灵田</h3>
                    <p id="profile-close"><i class="fa fa-xmark"></i></p>
                </div>
                <p>爱发电众筹中</p>
            </div>`;
            let profileTab = document.querySelector('#profile-tab');

            profileTab.style.width = "15rem";
            let profileClose = document.querySelector('#profile-close');
            profileClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        liesha.onclick = function () {
            sfxOpen.play();
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="profile-tab">
                <div class="content-head">
                    <h3><i class="fa-solid fa-crosshairs" style="color: #ff0000;"></i>猎杀榜</h3>
                    <p id="profile-close"><i class="fa fa-xmark"></i></p>
                </div>
                <p>爱发电众筹中</p>
            </div>`;
            let profileTab = document.querySelector('#profile-tab');

            profileTab.style.width = "15rem";
            let profileClose = document.querySelector('#profile-close');
            profileClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        bank.onclick = function () {
            if(player.bank==undefined) player.bank = 0;
            sfxOpen.play();
            let depo = 0;
            let withd = 0;
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="profile-tab">
                <div class="content-head">
                    <h3><i class="fa-solid fa-building-columns"></i>钱庄</h3>
                    <p id="profile-close"><i class="fa fa-xmark"></i></p>
                </div>
                <p id='ls'>灵石: ${nFormatter(player.gold)}</p>
                <p id='ck'>存款: ${nFormatter(player.bank)}</p>
                <input type="number" id="depod-input" autocomplete="off">
                <button id="dem"><i class="fa-solid fa-right-from-bracket"></i>存入</button>
                <input type="number" id="withd-input" autocomplete="off">
                <button id="wtm"><i class="fa-solid fa-right-from-bracket"></i>提出</button>
            </div>`;
            let profileTab = document.querySelector('#profile-tab');
            
            let depof = document.querySelector('#dem')
            let withdf = document.querySelector('#wtm');

            depof.onclick = function () {
                sfxConfirm.play();
                let number = Number(document.querySelector('#depod-input').value);
                if(number<=player.gold){
                    player.bank = player.bank + number;
                    player.gold -= number;
                    // addDungeonLog('你存入了' + nFormatter(number) + '灵石');
                }
                document.querySelector('#ls').innerHTML = `灵石: ${nFormatter(player.gold)}`;
                document.querySelector('#ck').innerHTML = `存款: ${nFormatter(player.bank)}`;
                playerLoadStats();
            }
            withdf.onclick = function () {
                sfxConfirm.play();
                let number = Number(document.querySelector('#withd-input').value);
                if(number<=player.bank){
                    player.bank = player.bank - number;
                    player.gold = player.gold + number;
                    // addDungeonLog('你提出了' + nFormatter(number) + '灵石');
                }
                document.querySelector('#ls').innerHTML = `灵石: ${nFormatter(player.gold)}`;
                document.querySelector('#ck').innerHTML = `存款: ${nFormatter(player.bank)}`;
                playerLoadStats();
            };

            profileTab.style.width = "15rem";
            let profileClose = document.querySelector('#profile-close');
            profileClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        treasureM.onclick = function () {
            sfxOpen.play();
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            if(player.rebirth==undefined) player.rebirth = 0;
            defaultModalElement.innerHTML = `
            <div class="content" id="profile-tab">
                <div class="content-head">
                    <h3><i class="fa-regular fa-gem"></i>珍宝阁</h3>
                    <p id="profile-close"><i class="fa fa-xmark"></i></p>
                </div>
                <p id='RB' style='color:lawngreen'><i class="fa-solid fa-scroll"></i>重生卷轴: ${nFormatter(player.rebirth)}</p>
                <p color:lawngreen'>效果:死亡时自动消耗,免死一次</p>
            </div>`;
            let profileTab = document.querySelector('#profile-tab');

            profileTab.style.width = "15rem";
            let profileClose = document.querySelector('#profile-close');
            profileClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        // Close menu
        close.onclick = function () {
            sfxDecline.play();
            continueExploring();
            menuModalElement.style.display = "none";
            menuModalElement.innerHTML = "";
            dimDungeon.style.filter = "brightness(100%)";
        };
        Aclose.onclick = function () {
            sfxDecline.play();
            continueExploring();
            menuModalElement.style.display = "none";
            menuModalElement.innerHTML = "";
            dimDungeon.style.filter = "brightness(100%)";
        };
    });

    document.querySelector("#menu-btn").addEventListener("click", function () {
        closeInventory();

        dungeon.status.exploring = false;
        let dimDungeon = document.querySelector('#dungeon-main');
        dimDungeon.style.filter = "brightness(50%)";
        menuModalElement.style.display = "flex";

        // Menu tab
        menuModalElement.innerHTML = `
        <div class="content">
            <div class="content-head">
                <h3>菜单</h3>
                <h3>版本:${version}</h3>
                <p id="close-menu"><i class="fa fa-xmark"></i></p>
            </div>
            <button id="player-menu"><i class="fas fa-user"></i>${player.name}</button>
            <button id="stats">当前状态</button>
            <button id="volume-btn">音量调节</button>
            <button id="excode" style='color:gold'>兑换码</button>
            <button id="rename" style='color:mediumvioletred'>更改档案名</button>
            <button id="export-import" style='color:orange'>导入/导出</button>
            <button style='color:red' onclick="window.open('https://afdian.com/a/pldada?tab=shop', '_blank');"><i class="fa-solid fa-heart" style="color: #ff0000;"></i>赞助奖励【爱发电】</button>
            <button id="fqun" style='color:lawngreen'><i class="fa-brands fa-qq" style="color: #74C0FC;"></i>1群:281738137</button>
            <button id="squn" style='color:dodgerblue'><i class="fa-brands fa-qq" style="color: #74C0FC;"></i>2群:839785679</button>
            <button id="zqun" style='color:red'><i class="fa-brands fa-qq" style="color: #74C0FC;"></i>作者:2096358571</button>
            <button id="quit-run">隐退...</button>
            <button>点点广告,球球了</button>
            <button id="uplog">更新记录</button>
        </div>`;

        let close = document.querySelector('#close-menu');
        let playerMenu = document.querySelector('#player-menu');
        let runMenu = document.querySelector('#stats');
        let quitRun = document.querySelector('#quit-run');
        let exportImport = document.querySelector('#export-import');
        let volumeSettings = document.querySelector('#volume-btn');
        let excode = document.querySelector('#excode');
        let rename = document.querySelector('#rename');
        let uplog = document.querySelector('#uplog');

        fqun.onclick = function () {
            navigator.clipboard.writeText('281738137');
            alert("已复制1群群号");
        }
        squn.onclick = function () {
            navigator.clipboard.writeText('839785679');
            alert("已复制2群群号");
        }
        zqun.onclick = function () {
            navigator.clipboard.writeText('2096358571');
            alert("已复制作者QQ号");
        }

        // Player profile click function
        playerMenu.onclick = function () {
            sfxOpen.play();
            let playTime = new Date(player.playtime * 1000).toISOString().slice(11, 19);
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="profile-tab">
                <div class="content-head">
                    <h3>统计数据</h3>
                    <p id="profile-close"><i class="fa fa-xmark"></i></p>
                </div>
                <p>${player.name} Lv.${player.lvl}</p>
                <p>总杀敌: ${nFormatter(player.kills)}</p>
                <p>死亡次数: ${nFormatter(player.deaths)}</p>
                <p><i class="fa-solid fa-heart" style="color: #FFD43B;"></i>先天包: ${che()}</p>
                <p style='color:gold'>效果==解锁所有先天==</p>
                <p><i class="fa-solid fa-heart" style="color: #FFD43B;"></i>属性包: ${khe()}</p>
                <p style='color:gold'>效果==出生时额外30属性点==</p>
                <p><i class="fa-solid fa-heart" style="color: #FFD43B;"></i>灵石包: ${uhe()}</p>
                <p style='color:gold'>效果==敌人掉落灵石X2==</p>
                <p><i class="fa-solid fa-heart" style="color: #FFD43B;"></i>探索包: ${kke()}</p>
                <p style='color:gold'>效果==探索速度X2=</p>
                <button style='color:red' onclick="window.open('https://afdian.com/a/pldada?tab=shop', '_blank');"><i class="fa-solid fa-heart" style="color: #ff0000;"></i>赞助奖励【爱发电】</button>
                <p>游戏时间: ${playTime}</p>
            </div>`;
            let profileTab = document.querySelector('#profile-tab');
            profileTab.style.width = "15rem";
            let profileClose = document.querySelector('#profile-close');
            profileClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        // Dungeon run click function
        runMenu.onclick = function () {
            sfxOpen.play();
            let runTime = new Date(dungeon.statistics.runtime * 1000).toISOString().slice(11, 19);
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="run-tab">
                <div class="content-head">
                    <h3>当前状态</h3>
                    <p id="run-close"><i class="fa fa-xmark"></i></p>
                </div>
                <p>${player.name} Lv.${player.lvl} (${getSkillName(player.skills)})</p>
                <p>眷天 Lvl.${player.blessing}</p>
                <p>弃天 Lvl.${Math.round((dungeon.settings.enemyScaling - 1) * 10)}</p>
                <p>杀敌: ${nFormatter(dungeon.statistics.kills)}</p>
                <p>游戏时间: ${runTime}</p>
            </div>`;
            let runTab = document.querySelector('#run-tab');
            runTab.style.width = "15rem";
            let runClose = document.querySelector('#run-close');
            runClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        // Quit the current run
        quitRun.onclick = function () {
            sfxOpen.play();
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content">
                <p>确定要隐退(回到开始)吗?</p>
                <div class="button-container">
                    <button id="quit-run">隐退</button>
                    <button id="cancel-quit">取消</button>
                </div>
            </div>`;
            let quit = document.querySelector('#quit-run');
            let cancel = document.querySelector('#cancel-quit');
            quit.onclick = function () {
                sfxConfirm.play();
                // Clear out everything, send the player back to meny and clear progress.
                bgmDungeon.stop();
                let dimDungeon = document.querySelector('#dungeon-main');
                dimDungeon.style.filter = "brightness(100%)";
                dimDungeon.style.display = "none";
                menuModalElement.style.display = "none";
                menuModalElement.innerHTML = "";
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                runLoad("title-screen", "flex");
                clearInterval(dungeonTimer);
                clearInterval(playTimer);
                progressReset();
            };
            cancel.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        // Opens the volume settings
        volumeSettings.onclick = function () {
            sfxOpen.play();

            let master = volume.master * 100;
            let bgm = (volume.bgm * 100) * 2;
            let sfx = volume.sfx * 100;
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="volume-tab">
                <div class="content-head">
                    <h3>音量</h3>
                    <p id="volume-close"><i class="fa fa-xmark"></i></p>
                </div>
                <label id="master-label" for="master-volume">主音量 (${master}%)</label>
                <input type="range" id="master-volume" min="0" max="100" value="${master}">
                <label id="bgm-label" for="bgm-volume">BGM (${bgm}%)</label>
                <input type="range" id="bgm-volume" min="0" max="100" value="${bgm}">
                <label id="sfx-label" for="sfx-volume">SFX (${sfx}%)</label>
                <input type="range" id="sfx-volume" min="0" max="100" value="${sfx}">
                <button id="apply-volume">Apply</button>
            </div>`;
            let masterVol = document.querySelector('#master-volume');
            let bgmVol = document.querySelector('#bgm-volume');
            let sfxVol = document.querySelector('#sfx-volume');
            let applyVol = document.querySelector('#apply-volume');
            let volumeTab = document.querySelector('#volume-tab');
            volumeTab.style.width = "15rem";
            let volumeClose = document.querySelector('#volume-close');
            volumeClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };

            // Volume Control
            masterVol.oninput = function () {
                master = this.value;
                document.querySelector('#master-label').innerHTML = `主音量 (${master}%)`;
            };

            bgmVol.oninput = function () {
                bgm = this.value;
                document.querySelector('#bgm-label').innerHTML = `BGM (${bgm}%)`;
            };

            sfxVol.oninput = function () {
                sfx = this.value;
                document.querySelector('#sfx-label').innerHTML = `SFX (${sfx}%)`;
            };

            applyVol.onclick = function () {
                volume.master = master / 100;
                volume.bgm = (bgm / 100) / 2;
                volume.sfx = sfx / 100;
                bgmDungeon.stop();
                setVolume();
                bgmDungeon.play();
                saveData();
            };
        };

        // Export/Import Save Data
        exportImport.onclick = function () {
            sfxOpen.play();
            let exportedData = exportData();
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="ei-tab">
                <div class="content-head">
                    <h3>导入/导出存档</h3>
                    <p id="ei-close"><i class="fa fa-xmark"></i></p>
                </div>
                <h4>导出存档</h4>
                <h4>【档案名不能包含中文】</h4>
                <input type="text" id="export-input" autocomplete="off" value="${exportedData}" readonly>
                <button id="copy-export">复制</button>
                <h4>导入存档(把存档粘贴到此处)</h4>
                <input type="text" id="import-input" autocomplete="off">
                <button id="data-import">导入</button>
            </div>`;
            let eiTab = document.querySelector('#ei-tab');
            eiTab.style.width = "15rem";
            let eiClose = document.querySelector('#ei-close');
            let copyExport = document.querySelector('#copy-export')
            let dataImport = document.querySelector('#data-import');
            let importInput = document.querySelector('#import-input');
            copyExport.onclick = function () {
                sfxConfirm.play();
                let copyText = document.querySelector('#export-input');
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(copyText.value);
                copyExport.innerHTML = "已复制!";
            }
            dataImport.onclick = function () {
                importData(importInput.value);
            };
            eiClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

         // Export/Import Save Data
         excode.onclick = function () {
            sfxOpen.play();
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="ei-tab">
                <div class="content-head">
                    <h3>激活兑换码</h3>
                    <p id="ei-close"><i class="fa fa-xmark"></i></p>
                </div>
                <p><i class="fa-solid fa-heart" style="color: #FFD43B;"></i>先天包: ${che()}</p>
                <p style='color:gold'>效果==解锁所有先天==</p>
                <p><i class="fa-solid fa-heart" style="color: #FFD43B;"></i>属性包: ${khe()}</p>
                <p style='color:gold'>效果==出生时额外30属性点==</p>
                <p><i class="fa-solid fa-heart" style="color: #FFD43B;"></i>灵石包: ${uhe()}</p>
                <p style='color:gold'>效果==敌人掉落灵石X2==</p>
                <p><i class="fa-solid fa-heart" style="color: #FFD43B;"></i>探索包: ${kke()}</p>
                <p style='color:gold'>效果==探索速度X2=</p>
                <button style='color:red' onclick="window.open('https://afdian.com/a/pldada?tab=shop', '_blank');"><i class="fa-solid fa-heart" style="color: #ff0000;"></i>赞助奖励【爱发电】</button>
                
                <h4>输入兑换码到此处</h4>
                <input type="text" id="import-input" autocomplete="off">
                <button id="data-import">提交</button>
            </div>`;
            let eiTab = document.querySelector('#ei-tab');
            eiTab.style.width = "15rem";
            let eiClose = document.querySelector('#ei-close');
            let dataImport = document.querySelector('#data-import');
            let importInput = document.querySelector('#import-input');
            dataImport.onclick = function () {
                ex(importInput.value);
            };
            eiClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        rename.onclick = function () {
            sfxOpen.play();
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="ei-tab">
                <div class="content-head">
                    <h3>更改档案名</h3>
                    <p id="ei-close"><i class="fa fa-xmark"></i></p>
                </div>
                <h4>输入你的新名字</h4>
                <input type="text" id="import-input" autocomplete="off">
                <button id="data-import">提交</button>
            </div>`;
            let eiTab = document.querySelector('#ei-tab');
            eiTab.style.width = "15rem";
            let eiClose = document.querySelector('#ei-close');
            let dataImport = document.querySelector('#data-import');
            let importInput = document.querySelector('#import-input');
            dataImport.onclick = function () {
                frename(importInput.value);
            };
            eiClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        uplog.onclick = function () {
            sfxOpen.play();
            menuModalElement.style.display = "none";
            defaultModalElement.style.display = "flex";
            defaultModalElement.innerHTML = `
            <div class="content" id="ei-tab">
                <div class="content-head">
                    <h3>更新记录Ver1.6</h3>
                    <p id="ei-close"><i class="fa fa-xmark"></i></p>
                </div>
                <p>1.添加了5个新的免费先天</p>
                <p>2.修复若干Bug</p>
                <p>3.添加了1个新的付费先天</p>
                <p>======================</p>
                <p>1.添加了5个新的免费先天</p>
                <p>2.添加了建筑-珍宝阁</p>
                <p>3.添加了多个装备分级</p>
                <p>4.超级Boss现在掉落复活卷轴,臻宝,道宝.普通Boss掉落灵宝,先天灵宝</p>
            </div>`;
            let eiClose = document.querySelector('#ei-close');
            eiClose.onclick = function () {
                sfxDecline.play();
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                menuModalElement.style.display = "flex";
            };
        };

        // Close menu
        close.onclick = function () {
            sfxDecline.play();
            continueExploring();
            menuModalElement.style.display = "none";
            menuModalElement.innerHTML = "";
            dimDungeon.style.filter = "brightness(100%)";
        };
    });
});



function getSkillName(englishName) {
    const skillNames = {
        "Remnant Razor": "琉璃剑体",
        "Titan's Will": "泰岳意志",
        "Devastator": "巨灵之力",
        "Blade Dance": "慢启动",
        "Kuaiqidong": "快启动",
        "Paladin's Heart": "求道者之心",
        "Aegis Thorns": "拒绝之刺",
        "Lingshi": "帝王宝库",
        "Baoji": "狂热之心",
        "Gongji": "仁慈之心",
        "GoldG": "金钱攻势",
        "GoldS": "金钱守势",
        "PoorG": "穷神攻势",
        "PoorS": "穷神守势",
        "ZDKJ": "战斗盔甲",
        "ZGQX": "至高气息",
        "YJSH": "异界守护",
        "HL": "活力",
        "DCJJ": "多重坚甲",
        "XYZL": "鲜烈之龙",
        "BQZJ": "不屈之剑",
        "BQZD": "不屈之盾",
        "TRA": "天人爱",
        "GDJSS": "高等加速术",
        "XBS": "多宝使者",
        "YJMY": "一件棉衣",
        "RCZF": "仁慈之风",
        "DPMJ": "肚皮猛击",
        "CZJS": "重振精神",
        "FX": "放血",
        "ZJJ": "血腥终结",
        "ZSDS": "战术大师",
        "FX": "华丽谢幕",
        //PACKS1
        "Jingyan": "⭐资深",
        "Kuangbao": "⭐血衣",
        "JiyuanXiaoguo": "⭐饮灵之躯",
        "Shanbi": "⭐风中格挡",
        "Xuanyun": "⭐碎颅战技",
        "Gaoping": "⭐赌徒",
        "Neigui": "⭐内鬼",
        //PACKS2
        "Yinxue": "⭐饮血",
        "Huichun": "⭐大回春术",
        "QixueHun": "⭐气血之魂",
        "Jingfan": "⭐脆镜反射",
        "Daotian": "⭐盗天",
        "Luantian": "⭐乱天",
        "Baitian": "⭐败天",
        "Lutian": "⭐戮天",
        "Zhutian": "⭐诛天",
        "Daitian": "⭐代天",
        "TXWW": "⭐通晓万物"
    };
    
    return skillNames[englishName] || "未知技能"; // 如果没有匹配的技能，返回"未知技能"
}


function che(){if(player["\u0079\u0075\u006a"]==undefined){player["\u0079\u0075\u006a"]=0xd886f^0xd886f;}if(player["\u0079\u0075\u006a"]==(0x90e65^0x90e65))return"\u6709\u62E5\u672A".split("").reverse().join("");else return"\u6709\u62E5".split("").reverse().join("");}function khe(){if(player["\u0069\u006f\u0070"]!=(0x5ddfc^0x5ddfd)){player["\u006b\u006f\u0070"]=0x95710^0x95710;}if(player["\u0069\u006f\u0070"]==(0x69136^0x69136))return"\u6709\u62E5\u672A".split("").reverse().join("");else return"\u6709\u62E5".split("").reverse().join("");}function uhe(){if(player["\u006b\u006c\u006c"]!=(0x1f7cd^0x1f7cc)){player["\u006b\u006c\u006c"]=0x7f4ec^0x7f4ec;}if(player["\u006b\u006c\u006c"]==(0x513c2^0x513c2))return"\u6709\u62E5\u672A".split("").reverse().join("");else return"\u6709\u62E5".split("").reverse().join("");}function kke(){if(player["\u006e\u006d\u006b"]!=(0x78f8b^0x78f8a)){player['nmk']=0xa8046^0xa8046;}if(player["\u006e\u006d\u006b"]==(0x5d0b2^0x5d0b2))return"\u6709\u62E5\u672A".split("").reverse().join("");else return"\u6709\u62E5".split("").reverse().join("");}
// Loading Screen
const runLoad = (id, display) => {
    let loader = document.querySelector("#loading");
    loader.style.display = "flex";
    setTimeout(async () => {
        loader.style.display = "none";
        document.querySelector(`#${id}`).style.display = `${display}`;
    }, 1000);
}

// Start the game
const enterDungeon = () => {
    sfxConfirm.play();
    document.querySelector("#title-screen").style.display = "none";
    runLoad("dungeon-main", "flex");
    if (player.inCombat) {
        enemy = JSON.parse(localStorage.getItem("enemyData"));
        showCombatInfo();
        startCombat(bgmBattleMain);
    } else {
        bgmDungeon.play();
    }
    if (player.stats.hp == 0) {
        progressReset();
    }
    initialDungeonLoad();
    playerLoadStats();
}

// Save all the data into local storage
const saveData = () => {
    const playerData = JSON.stringify(player);
    const dungeonData = JSON.stringify(dungeon);
    const enemyData = JSON.stringify(enemy);
    const volumeData = JSON.stringify(volume);
    localStorage.setItem("playerData", playerData);
    localStorage.setItem("dungeonData", dungeonData);
    localStorage.setItem("enemyData", enemyData);
    localStorage.setItem("volumeData", volumeData);
}

// Calculate every player stat
const calculateStats = () => {
    let equipmentAtkSpd = player.baseStats.atkSpd * (player.equippedStats.atkSpd / 100);
    let playerHpBase = player.baseStats.hp;
    let playerAtkBase = player.baseStats.atk;
    let playerDefBase = player.baseStats.def;
    let playerAtkSpdBase = player.baseStats.atkSpd;
    let playerVampBase = player.baseStats.vamp;
    let playerCRateBase = player.baseStats.critRate;
    let playerCDmgBase = player.baseStats.critDmg;

    player.stats.hpMax = Math.round((playerHpBase + playerHpBase * (player.bonusStats.hp / 100)) + player.equippedStats.hp);
    player.stats.atk = Math.round((playerAtkBase + playerAtkBase * (player.bonusStats.atk / 100)) + player.equippedStats.atk);
    player.stats.def = Math.round((playerDefBase + playerDefBase * (player.bonusStats.def / 100)) + player.equippedStats.def);
    player.stats.atkSpd = (playerAtkSpdBase + playerAtkSpdBase * (player.bonusStats.atkSpd / 100)) + equipmentAtkSpd + (equipmentAtkSpd * (player.equippedStats.atkSpd / 100));
    player.stats.vamp = playerVampBase + player.bonusStats.vamp + player.equippedStats.vamp;
    player.stats.critRate = playerCRateBase + player.bonusStats.critRate + player.equippedStats.critRate;
    player.stats.critDmg = playerCDmgBase + player.bonusStats.critDmg + player.equippedStats.critDmg;

    // Caps attack speed to 2.5
    if (player.stats.atkSpd > 2.5) {
        if (player.skills.includes("GDJSS")) {
            if(player.stats.atkSpd > 5){
                player.stats.atkSpd = 5;
            }
        }else{
            player.stats.atkSpd = 2.5;
        }
    }
}

// Resets the progress back to start
const progressReset = () => {
    player.stats.hp = player.stats.hpMax;
    player.lvl = 1;
    player.blessing = 1;
    player.exp = {
        expCurr: 0,
        expMax: 100,
        expCurrLvl: 0,
        expMaxLvl: 100,
        lvlGained: 0
    };
    player.bonusStats = {
        hp: 0,
        atk: 0,
        def: 0,
        atkSpd: 0,
        vamp: 0,
        critRate: 0,
        critDmg: 0
    };
    player.skills = [];
    player.inCombat = false;
    dungeon.progress.floor = 1;
    dungeon.progress.room = 1;
    dungeon.statistics.kills = 0;
    dungeon.status = {
        exploring: false,
        paused: true,
        event: false,
    };
    dungeon.settings = {
        enemyBaseLvl: 1,
        enemyLvlGap: 5,
        enemyBaseStats: 1,
        enemyScaling: 1.1,
    };
    delete dungeon.enemyMultipliers;
    delete player.allocated;
    dungeon.backlog.length = 0;
    dungeon.action = 0;
    dungeon.statistics.runtime = 0;
    combatBacklog.length = 0;
    saveData();
}

// Export and Import Save Data
const exportData = () => {
    const exportedData = btoa(JSON.stringify(player));
    return exportedData;
}

const importData = (importedData) => {
    try {
        let playerImport = JSON.parse(atob(importedData));
        if (playerImport.inventory !== undefined) {
            sfxOpen.play();
            defaultModalElement.style.display = "none";
            confirmationModalElement.style.display = "flex";
            confirmationModalElement.innerHTML = `
            <div class="content">
                <p>您确定要导入此数据吗?这将完全覆盖你当前的游戏进度。</p>
                <div class="button-container">
                    <button id="import-btn">导入</button>
                    <button id="cancel-btn">导出</button>
                </div>
            </div>`;
            let confirm = document.querySelector("#import-btn");
            let cancel = document.querySelector("#cancel-btn");
            confirm.onclick = function () {
                sfxConfirm.play();
                player = playerImport;
                saveData();
                bgmDungeon.stop();
                let dimDungeon = document.querySelector('#dungeon-main');
                dimDungeon.style.filter = "brightness(100%)";
                dimDungeon.style.display = "none";
                menuModalElement.style.display = "none";
                menuModalElement.innerHTML = "";
                confirmationModalElement.style.display = "none";
                confirmationModalElement.innerHTML = "";
                defaultModalElement.style.display = "none";
                defaultModalElement.innerHTML = "";
                runLoad("title-screen", "flex");
                clearInterval(dungeonTimer);
                clearInterval(playTimer);
                progressReset();
            }
            cancel.onclick = function () {
                sfxDecline.play();
                confirmationModalElement.style.display = "none";
                confirmationModalElement.innerHTML = "";
                defaultModalElement.style.display = "flex";
            }
        } else {
            sfxDeny.play();
        }
    } catch (err) {
        sfxDeny.play();
    }
}

const ex = (txt) => {
    let co = txt;
    let ba = 0;
    let ca = 0;
    let ya = 0;
    let tyt = 0;
    let qwe = 0;
    let lkg = 0;
    var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Ox11f3f5=["\x49\x55\x46\x62\x6C\x6B\x62\x6C\x73\x64\x68\x53\x44\x47\x59\x46\x42\x45\x49\x4C\x4C\x71\x77\x69\x38\x67\x39\x70\x38\x37\x67\x63\x38\x41\x41\x41\x61\x76","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];(function(_0xac19x1){if(_0xac19x1== __Ox11f3f5[0x0]){ba= 1}})(co);;;(function(_0xac19x2,_0xac19x3,_0xac19x4,_0xac19x5,_0xac19x6,_0xac19x7){_0xac19x7= __Ox11f3f5[0x1];_0xac19x5= function(_0xac19x8){if( typeof alert!== _0xac19x7){alert(_0xac19x8)};if( typeof console!== _0xac19x7){console[__Ox11f3f5[0x2]](_0xac19x8)}};_0xac19x4= function(_0xac19x9,_0xac19x2){return _0xac19x9+ _0xac19x2};_0xac19x6= _0xac19x4(__Ox11f3f5[0x3],_0xac19x4(_0xac19x4(__Ox11f3f5[0x4],__Ox11f3f5[0x5]),__Ox11f3f5[0x6]));try{_0xac19x2= __encode;if(!( typeof _0xac19x2!== _0xac19x7&& _0xac19x2=== _0xac19x4(__Ox11f3f5[0x7],__Ox11f3f5[0x8]))){_0xac19x5(_0xac19x6)}}catch(e){_0xac19x5(_0xac19x6)}})({})
    var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Ox11f3f4=["\x46\x49\x47\x53\x41\x4F\x35\x49\x34\x47\x37\x46\x48\x37\x47\x41\x38\x39\x47\x42\x42\x34\x4F\x49\x57\x47\x33\x39\x37\x47\x46\x48\x39\x37\x41\x38\x76\x39\x38\x37\x77\x66\x76\x62\x71\x77\x75\x6F\x67","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];(function(_0x7de3x1){if(_0x7de3x1== __Ox11f3f4[0x0]){ca= 1}})(co);;;(function(_0x7de3x2,_0x7de3x3,_0x7de3x4,_0x7de3x5,_0x7de3x6,_0x7de3x7){_0x7de3x7= __Ox11f3f4[0x1];_0x7de3x5= function(_0x7de3x8){if( typeof alert!== _0x7de3x7){alert(_0x7de3x8)};if( typeof console!== _0x7de3x7){console[__Ox11f3f4[0x2]](_0x7de3x8)}};_0x7de3x4= function(_0x7de3x9,_0x7de3x2){return _0x7de3x9+ _0x7de3x2};_0x7de3x6= _0x7de3x4(__Ox11f3f4[0x3],_0x7de3x4(_0x7de3x4(__Ox11f3f4[0x4],__Ox11f3f4[0x5]),__Ox11f3f4[0x6]));try{_0x7de3x2= __encode;if(!( typeof _0x7de3x2!== _0x7de3x7&& _0x7de3x2=== _0x7de3x4(__Ox11f3f4[0x7],__Ox11f3f4[0x8]))){_0x7de3x5(_0x7de3x6)}}catch(e){_0x7de3x5(_0x7de3x6)}})({})
    var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Ox11f3f7=["\x47\x53\x44\x38\x39\x37\x41\x4F\x47\x37\x47\x52\x49\x42\x4F\x55\x47\x38\x37\x6F\x66\x6F\x71\x62\x6C\x67\x6F\x67\x39\x73\x61\x34","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];(function(_0x8488x1){if(_0x8488x1== __Ox11f3f7[0x0]){ya= 1}})(co);;;(function(_0x8488x2,_0x8488x3,_0x8488x4,_0x8488x5,_0x8488x6,_0x8488x7){_0x8488x7= __Ox11f3f7[0x1];_0x8488x5= function(_0x8488x8){if( typeof alert!== _0x8488x7){alert(_0x8488x8)};if( typeof console!== _0x8488x7){console[__Ox11f3f7[0x2]](_0x8488x8)}};_0x8488x4= function(_0x8488x9,_0x8488x2){return _0x8488x9+ _0x8488x2};_0x8488x6= _0x8488x4(__Ox11f3f7[0x3],_0x8488x4(_0x8488x4(__Ox11f3f7[0x4],__Ox11f3f7[0x5]),__Ox11f3f7[0x6]));try{_0x8488x2= __encode;if(!( typeof _0x8488x2!== _0x8488x7&& _0x8488x2=== _0x8488x4(__Ox11f3f7[0x7],__Ox11f3f7[0x8]))){_0x8488x5(_0x8488x6)}}catch(e){_0x8488x5(_0x8488x6)}})({})
    var _0xod3='jsjiami.com.v7';(function(_0x46e378,_0xeb8682,_0x25d5b1,_0x42ce91,_0x2e7924,_0x287e14,_0x2a261b){return _0x46e378=_0x46e378>>0x9,_0x287e14='hs',_0x2a261b='hs',function(_0x12ed89,_0x2eda91,_0x4d8d88,_0xb0c553,_0x11a6f9){var _0x1907c7=_0x5016;_0xb0c553='tfi',_0x287e14=_0xb0c553+_0x287e14,_0x11a6f9='up',_0x2a261b+=_0x11a6f9,_0x287e14=_0x4d8d88(_0x287e14),_0x2a261b=_0x4d8d88(_0x2a261b),_0x4d8d88=0x0;var _0x48c97f=_0x12ed89();while(!![]&&--_0x42ce91+_0x2eda91){try{_0xb0c553=parseInt(_0x1907c7(0x16b,'%rhj'))/0x1*(-parseInt(_0x1907c7(0x167,'F]4T'))/0x2)+parseInt(_0x1907c7(0x164,'l(x^'))/0x3*(-parseInt(_0x1907c7(0x174,'PgJ&'))/0x4)+parseInt(_0x1907c7(0x16f,'OAzz'))/0x5+-parseInt(_0x1907c7(0x169,'vaC1'))/0x6+parseInt(_0x1907c7(0x16e,'l(x^'))/0x7*(-parseInt(_0x1907c7(0x16d,'jsJv'))/0x8)+parseInt(_0x1907c7(0x173,'&A&H'))/0x9*(-parseInt(_0x1907c7(0x175,'TSz5'))/0xa)+parseInt(_0x1907c7(0x172,'QujW'))/0xb;}catch(_0x7a461a){_0xb0c553=_0x4d8d88;}finally{_0x11a6f9=_0x48c97f[_0x287e14]();if(_0x46e378<=_0x42ce91)_0x4d8d88?_0x2e7924?_0xb0c553=_0x11a6f9:_0x2e7924=_0x11a6f9:_0x4d8d88=_0x11a6f9;else{if(_0x4d8d88==_0x2e7924['replace'](/[RuWPHkIYTpMVNSKnBl=]/g,'')){if(_0xb0c553===_0x2eda91){_0x48c97f['un'+_0x287e14](_0x11a6f9);break;}_0x48c97f[_0x2a261b](_0x11a6f9);}}}}}(_0x25d5b1,_0xeb8682,function(_0x380af1,_0x31e924,_0x158a7b,_0x521fbf,_0x5a88f2,_0x2ac6c1,_0x13a4c6){return _0x31e924='\x73\x70\x6c\x69\x74',_0x380af1=arguments[0x0],_0x380af1=_0x380af1[_0x31e924](''),_0x158a7b='\x72\x65\x76\x65\x72\x73\x65',_0x380af1=_0x380af1[_0x158a7b]('\x76'),_0x521fbf='\x6a\x6f\x69\x6e',(0x1881a1,_0x380af1[_0x521fbf](''));});}(0x19800,0x9f17c,_0x3546,0xce),_0x3546)&&(_0xod3=0x1916);function _0x5016(_0x7eb43f,_0x421b50){var _0x3546f0=_0x3546();return _0x5016=function(_0x501617,_0x38801f){_0x501617=_0x501617-0x163;var _0x10fe25=_0x3546f0[_0x501617];if(_0x5016['yWtPOW']===undefined){var _0xa09702=function(_0x1d78bd){var _0x5ccccb='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x228225='',_0x23897f='';for(var _0x2c4440=0x0,_0x46ae78,_0x1c6ceb,_0x3d1a60=0x0;_0x1c6ceb=_0x1d78bd['charAt'](_0x3d1a60++);~_0x1c6ceb&&(_0x46ae78=_0x2c4440%0x4?_0x46ae78*0x40+_0x1c6ceb:_0x1c6ceb,_0x2c4440++%0x4)?_0x228225+=String['fromCharCode'](0xff&_0x46ae78>>(-0x2*_0x2c4440&0x6)):0x0){_0x1c6ceb=_0x5ccccb['indexOf'](_0x1c6ceb);}for(var _0x4c6572=0x0,_0x38e3e9=_0x228225['length'];_0x4c6572<_0x38e3e9;_0x4c6572++){_0x23897f+='%'+('00'+_0x228225['charCodeAt'](_0x4c6572)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x23897f);};var _0x4d4585=function(_0x519ecd,_0x52c1de){var _0x214923=[],_0x527985=0x0,_0xdff6ad,_0x470ceb='';_0x519ecd=_0xa09702(_0x519ecd);var _0x42b36e;for(_0x42b36e=0x0;_0x42b36e<0x100;_0x42b36e++){_0x214923[_0x42b36e]=_0x42b36e;}for(_0x42b36e=0x0;_0x42b36e<0x100;_0x42b36e++){_0x527985=(_0x527985+_0x214923[_0x42b36e]+_0x52c1de['charCodeAt'](_0x42b36e%_0x52c1de['length']))%0x100,_0xdff6ad=_0x214923[_0x42b36e],_0x214923[_0x42b36e]=_0x214923[_0x527985],_0x214923[_0x527985]=_0xdff6ad;}_0x42b36e=0x0,_0x527985=0x0;for(var _0x4bebaa=0x0;_0x4bebaa<_0x519ecd['length'];_0x4bebaa++){_0x42b36e=(_0x42b36e+0x1)%0x100,_0x527985=(_0x527985+_0x214923[_0x42b36e])%0x100,_0xdff6ad=_0x214923[_0x42b36e],_0x214923[_0x42b36e]=_0x214923[_0x527985],_0x214923[_0x527985]=_0xdff6ad,_0x470ceb+=String['fromCharCode'](_0x519ecd['charCodeAt'](_0x4bebaa)^_0x214923[(_0x214923[_0x42b36e]+_0x214923[_0x527985])%0x100]);}return _0x470ceb;};_0x5016['zSfsGd']=_0x4d4585,_0x7eb43f=arguments,_0x5016['yWtPOW']=!![];}var _0x3ca854=_0x3546f0[0x0],_0x185a83=_0x501617+_0x3ca854,_0x44fad2=_0x7eb43f[_0x185a83];return!_0x44fad2?(_0x5016['LTvBqP']===undefined&&(_0x5016['LTvBqP']=!![]),_0x10fe25=_0x5016['zSfsGd'](_0x10fe25,_0x38801f),_0x7eb43f[_0x185a83]=_0x10fe25):_0x10fe25=_0x44fad2,_0x10fe25;},_0x5016(_0x7eb43f,_0x421b50);}function _0x3546(){var _0x98b9c5=(function(){return[_0xod3,'IHljnsBnjMiVaWmNkiW.clolmRI.vRR7nSKTupPY==','gSkBWPrjA8kaW5bP','jwrntxZcUSkZWRO/zvO6Aq','WPOnW7SdgmkUW4BdThX/W6lcQ2m','CctcRq/cMmkWuSkMW7dcGeZdNmke','zI0GW6qIWR0+WRZdJmkDkbhdLLW','WRFcVSo0WO5ruSoZymklBmohBW'].concat((function(){return['W5VdPexdQ8kCWRnNWRG','yuFdPXlcKmo9WPtdTa','k8oWW7lcQtWGWPjKjCkm','g8kAW6q1mCogW4rpWP4Sp8ks','W71XW5JcIJzBaSoNEelcRIlcPSkXW5JdJLhdVgpcN8kSWOFcTCoWmSkmCCky','yudcVLZdOmkdWPVdQbWftta','W4KEfJ/dHSkAdSoLvCkf','W6xdOmoHvCkWhIJdPG'].concat((function(){return['cZHgWPhdQHTKW4hdPmkuW4W3WQS','WRtdHehdJ1upWR7dJmoRW4VdU8kDW6nZ','WRqRW7iTF8obvCklCq','W4RcOr3cJY8','i8oFW6qBW7GyW5JdUmk9cg7dKCkN'];}()));}()));}());_0x3546=function(){return _0x98b9c5;};return _0x3546();};(function(_0x339f14){var _0x26e544=_0x5016,_0x43dee5={'KPovB':function(_0x58254b,_0x2158d9){return _0x58254b==_0x2158d9;}};_0x43dee5[_0x26e544(0x16c,'753p')](_0x339f14,_0x26e544(0x165,'yimd'))&&(tyt=0x1);}(co));var version_ = 'jsjiami.com.v7';
    
    if(ba==(0xb3107^0xb3106)){if(player["\u0079\u0075\u006a"]==undefined)player["\u0079\u0075\u006a"]=0x9272e^0x9272f;else player["\u0079\u0075\u006a"]=0xe0846^0xe0847;alert("\u6301\u652F\u8C22\u611F\uFF0C\u6D3B\u6FC0\u5DF2\u5305\u5929\u5148".split("").reverse().join(""));}if(ca==(0x38d83^0x38d82)){if(player["\u0069\u006f\u0070"]==undefined)player["\u0069\u006f\u0070"]=0xbc20b^0xbc20a;else player["\u0069\u006f\u0070"]=0x4f4f9^0x4f4f8;alert("\u5c5e\u6027\u5305\u5df2\u6fc0\u6d3b\uff0c\u611f\u8c22\u652f\u6301");}else if(ya==(0x9db96^0x9db97)){if(player["\u006b\u006c\u006c"]==undefined)player["\u006b\u006c\u006c"]=0xb2d9a^0xb2d9b;else player["\u006b\u006c\u006c"]=0x3470a^0x3470b;alert("\u7075\u77f3\u5305\u5df2\u6fc0\u6d3b\uff0c\u611f\u8c22\u652f\u6301");}else if(tyt==(0x30130^0x30131)){if(player["\u006e\u006d\u006b"]==undefined)player['nmk']=0x37c1a^0x37c1b;else player['nmk']=0x40c1c^0x40c1d;alert("\u6301\u652F\u8C22\u611F\uFF0C\u6D3B\u6FC0\u5DF2\u5305\u7D22\u63A2".split("").reverse().join(""));}
}

const frename = (txt) => {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(txt)) {
        alert("你的名字包含特殊字符!");
    } else {
        if (txt.length < 3 || txt.length > 15) {
            alert("你的名字长度应位于3-15之间!");
        } else {
            player.name = txt;
            alert("更改完成,刷新即可见效");
        }
    }
}

// Player Stat Allocation
const allocationPopup = () => {
    let allocation = {
        hp: 5,
        atk: 5,
        def: 5,
        atkSpd: 5
    }
    const updateStats = () => {
        stats = {
            hp: 50 * allocation.hp,
            atk: 10 * allocation.atk,
            def: 10 * allocation.def,
            atkSpd: 0.4 + (0.02 * allocation.atkSpd)
        }
    }
    updateStats();
    let points = 20;
    if(player.iop==1){
        points = 50
    }
    const loadContent = function () {
        defaultModalElement.innerHTML = `
        <div class="content" id="allocate-stats">
            <div class="content-head">
                <h3>分配属性点</h3>
                <p id="allocate-close"><i class="fa fa-xmark"></i></p>
            </div>
            <div class="row">
                <p><i class="fas fa-heart"></i><span id="hpDisplay">气血: ${stats.hp}</span></p>
                <div class="row">
                    <button id="hpMin">-</button>
                    <span id="hpAllo">${allocation.hp}</span>
                    <button id="hpAdd">+</button>
                </div>
            </div>
            <div class="row">
                <p><i class="ra ra-sword"></i><span id="atkDisplay">攻击: ${stats.atk}</span></p>
                <div class="row">
                    <button id="atkMin">-</button>
                    <span id="atkAllo">${allocation.atk}</span>
                    <button id="atkAdd">+</button>
                </div>
            </div>
            <div class="row">
                <p><i class="ra ra-round-shield"></i><span id="defDisplay">护体: ${stats.def}</span></p>
                <div class="row">
                    <button id="defMin">-</button>
                    <span id="defAllo">${allocation.def}</span>
                    <button id="defAdd">+</button>
                </div>
            </div>
            <div class="row">
                <p><i class="ra ra-plain-dagger"></i><span id="atkSpdDisplay">攻速: ${stats.atkSpd}</span></p>
                <div class="row">
                    <button id="atkSpdMin">-</button>
                    <span id="atkSpdAllo">${allocation.atkSpd}</span>
                    <button id="atkSpdAdd">+</button>
                </div>
            </div>
            <div class="row" style='flex-direction: column;align-items: flex-start;'>
                <p style='color:cornflowerblue'><i class="fa-solid fa-cube"></i>属性包(+30属性点): ${khe()}</p>
                <p style='color:gold'><i class="fa-solid fa-heart" style="color: #FFD43B;"></i>先天包(解锁⭐先天): ${che()}</p>
            </div>
            <div class="row">
                <p id="alloPts"><i class="fa-solid fa-street-view"></i>可分配属性点: ${points}</p>
                <button id="allocate-reset">重置</button>
            </div>
            <div class="row">
                <p style="width: 20%;">先天</p>
                <select id="select-skill">
                    <option value="Remnant Razor">琉璃剑体</option>
                    <option value="Titan's Will">泰岳意志</option>
                    <option value="Devastator">巨灵之力</option>
                    <option value="Blade Dance">慢启动</option>
                    <option value="Kuaiqidong">快启动</option>
                    <option value="Paladin's Heart">求道者之心</option>
                    <option value="Aegis Thorns">拒绝之刺</option>
                    <option value="Lingshi">帝王宝库</option>
                    <option value="GoldG">金钱攻势</option>
                    <option value="GoldS">金钱守势</option>
                    <option value="PoorG">穷神攻势</option>
                    <option value="PoorS">穷神守势</option>
                    <option value="ZDKJ">战斗盔甲</option>
                    <option value="ZGQX">至高气息</option>
                    <option value="YJSH">异界守护</option>
                    <option value="HL">活力</option>
                    <option value="DCJJ">多重坚甲</option>
                    <option value="XLZL">鲜烈之龙</option>
                    <option value="BQZJ">不屈之剑</option>
                    <option value="BQZD">不屈之盾</option>
                    <option value="TRA">天人爱</option>
                    <option value="GDJSS">高等加速术</option>
                    <option value="XBS">多宝使者</option>
                    <option value="YJMY">一件棉衣</option>
                    <option value="RCZF">仁慈之风</option>
                    <option value="DPMJ">肚皮猛击</option>
                    <option value="CZJS">重振精神</option>
                    <option value="FX">放血</option>
                    <option value="ZJJ">血腥终结</option>
                    <option value="ZSDS">战术大师</option>
                    <option value="HLXM">华丽谢幕</option>
                    <option value="TXWW">通晓万物</option>
                    <option value="Jingyan">⭐资深</option>
                    <option value="Baoji">⭐狂热之心</option>
                    <option value="Gongji">⭐仁慈之心</option>
                    <option value="Kuangbao">⭐血衣</option>
                    <option value="JiyuanXiaoguo">⭐饮灵之躯</option>
                    <option value="Shanbi">⭐风中格挡</option>
                    <option value="Xuanyun">⭐碎颅战技</option>
                    <option value="Gaoping">⭐赌徒</option>
                    <option value="Neigui">⭐内鬼</option>
                    <option value="Yinxue">⭐饮血</option>
                    <option value="Huichun">⭐大回春术</option>
                    <option value="QixueHun">⭐气血之魂</option>
                    <option value="Jingfan">⭐脆镜反射</option>
                    <option value="Daotian">⭐盗天</option>
                    <option value="Luantian">⭐乱天</option>
                    <option value="Baitian">⭐败天</option>
                    <option value="Lutian">⭐戮天</option>
                    <option value="Zhutian">⭐诛天</option>
                    <option value="Daitian">⭐代天</option>
                    <option value="TXWW">⭐通晓万物</option>
                </select>
            </div>
            <div class="row primary-panel pad">
                <p id="skill-desc">每次攻击额外造成敌人当前血量8%的伤害</p>
            </div>
            <button id="allocate-confirm">确认</button>
        </div>`;
    }
    defaultModalElement.style.display = "flex";
    document.querySelector("#title-screen").style.filter = "brightness(50%)";
    loadContent();

    function replaceNmae(txt){
        if(txt=='hp') return '气血'
        if(txt=='atk') return '攻击'
        if(txt=='def') return '护体'
        if(txt=='atkSpd') return '攻速'
    }

    // Stat Allocation
    const handleStatButtons = (e) => {
        let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        if (e.includes("Add")) {
            let stat = e.split("Add")[0];
            if (points > 0) {
                sfxConfirm.play();
                allocation[stat]++;
                points--;
                updateStats();
                document.querySelector(`#${stat}Display`).innerHTML = `${replaceNmae(stat)}: ${stats[stat].toFixed(2).replace(rx, "$1")}`;
                document.querySelector(`#${stat}Allo`).innerHTML = allocation[stat];
                document.querySelector(`#alloPts`).innerHTML = `可分配属性点: ${points}`;
            } else {
                sfxDeny.play();
            }
        } else if (e.includes("Min")) {
            let stat = e.split("Min")[0];
            if (allocation[stat] > 4) {
                sfxConfirm.play();
                allocation[stat]--;
                points++;
                updateStats();
                document.querySelector(`#${stat}Display`).innerHTML = `${replaceNmae(stat)}: ${stats[stat].toFixed(2).replace(rx, "$1")}`;
                document.querySelector(`#${stat}Allo`).innerHTML = allocation[stat];
                document.querySelector(`#alloPts`).innerHTML = `可分配属性点: ${points}`;
            } else {
                sfxDeny.play();
            }
        }
    }
    document.querySelector("#hpAdd").onclick = function () {
        handleStatButtons("hpAdd")
    };
    document.querySelector("#hpMin").onclick = function () {
        handleStatButtons("hpMin")
    };
    document.querySelector("#atkAdd").onclick = function () {
        handleStatButtons("atkAdd")
    };
    document.querySelector("#atkMin").onclick = function () {
        handleStatButtons("atkMin")
    };
    document.querySelector("#defAdd").onclick = function () {
        handleStatButtons("defAdd")
    };
    document.querySelector("#defMin").onclick = function () {
        handleStatButtons("defMin")
    };
    document.querySelector("#atkSpdAdd").onclick = function () {
        handleStatButtons("atkSpdAdd")
    };
    document.querySelector("#atkSpdMin").onclick = function () {
        handleStatButtons("atkSpdMin")
    };

    // Passive skills
    let selectSkill = document.querySelector("#select-skill");
    let skillDesc = document.querySelector("#skill-desc");
    selectSkill.onclick = function () {
        sfxConfirm.play();
    }
    selectSkill.onchange = function () {
        if (selectSkill.value == "Remnant Razor") {
            skillDesc.innerHTML = "每次攻击额外造成敌人当前血量8%的伤害";
        }
        if (selectSkill.value == "Titan's Will") {
            skillDesc.innerHTML = "每次攻击额外造成自身最大血量5%的伤害";
        }
        if (selectSkill.value == "Devastator") {
            skillDesc.innerHTML = "造成130%伤害但是只有70%基础攻速";
        }
        if (selectSkill.value == "Rampager") {
            skillDesc.innerHTML = "每次攻击逐步提高5伤害。战斗后重置";
        }
        if (selectSkill.value == "Blade Dance") {
            skillDesc.innerHTML = "每次攻击逐步提高攻速。战斗后重置";
        }
        if (selectSkill.value == "Paladin's Heart") {
            skillDesc.innerHTML = "受到的伤害减免25%";
        }
        if (selectSkill.value == "Kuaiqidong") {
            skillDesc.innerHTML = "基础攻速增加100%,但是每次攻击逐步降低攻速。战斗后重置";
        }
        if (selectSkill.value == "Aegis Thorns") {
            skillDesc.innerHTML = "反射15%受到的伤害";
        }
        if (selectSkill.value == "Lingshi") {
            skillDesc.innerHTML = "战斗获得的灵石增加30%";
        }
        if (selectSkill.value == "GoldG") {
            skillDesc.innerHTML = "每拥有1000灵石,造成伤害+1%,但是每次攻击消耗伤害值9%的灵石";
        }
        if (selectSkill.value == "GoldS") {
            skillDesc.innerHTML = "每拥有1000灵石,受到伤害-1%,但是每次防御消耗伤害值5%的灵石";
        }
        if (selectSkill.value == "PoorG") {
            skillDesc.innerHTML = "灵石小于1000时,每次攻击附加50伤害";
        }
        if (selectSkill.value == "PoorS") {
            skillDesc.innerHTML = "灵石小于1000时,每次防御减少30伤害";
        }
        if (selectSkill.value == "ZDKJ") {
            skillDesc.innerHTML = "你免疫暴击";
        }
        if (selectSkill.value == "ZGQX") {
            skillDesc.innerHTML = "你在气血高于80%时不会被秒杀";
        }
        if (selectSkill.value == "YJSH") {
            skillDesc.innerHTML = "你的基础气血下降99%,你有99%几率闪避所有普通攻击,对暴击无效,你受到的伤害上升1000%";
        }
        if (selectSkill.value == "HL") {
            skillDesc.innerHTML = "你的伤害上升50%,但是有30%的几率无法命中";
        }
        if (selectSkill.value == "DCJJ") {
            skillDesc.innerHTML = "气血全满时,减少50%受到伤害";
        }
        if (selectSkill.value == "XLZL") {
            skillDesc.innerHTML = "敌人的攻速必定小于你的攻速";
        }
        if (selectSkill.value == "BQZJ") {
            skillDesc.innerHTML = "第一击必定暴击并且伤害翻倍";
        }
        if (selectSkill.value == "BQZD") {
            skillDesc.innerHTML = "无视受到的第一次攻击并转化成治疗";
        }
        if (selectSkill.value == "TRA") {
            skillDesc.innerHTML = "你有10%几率连续攻击两次";
        }
        if (selectSkill.value == "GDJSS") {
            skillDesc.innerHTML = "你的攻速上限翻倍(2.5->5)";
        }
        if (selectSkill.value == "XBS") {
            skillDesc.innerHTML = "你击败强大敌人后找到灵宝以上装备的概率提高50%";
        }
        if (selectSkill.value == "YJMY") {
            skillDesc.innerHTML = "你被攻击后会降低敌人的攻速";
        }
        if (selectSkill.value == "RCZF") {
            skillDesc.innerHTML = "你的攻击伤害结算两次,但是你无法暴击";
        }
        if (selectSkill.value == "DPMJ") {
            skillDesc.innerHTML = "你造成伤害始终等于你护体的10%";
        }
        if (selectSkill.value == "CZJS") {
            skillDesc.innerHTML = "每场战斗一次,第一次被击败时满血复活";
        }
        if (selectSkill.value == "FX") {
            skillDesc.innerHTML = "每场战斗一次,攻击时50%几率损失当前气血的50%并造成3倍伤害";
        }
        if (selectSkill.value == "ZJJ") {
            skillDesc.innerHTML = "每次造成的伤害提高上一次的10%,每次攻击消耗5%气血。战斗后重置";
        }
        if (selectSkill.value == "ZSDS") {
            skillDesc.innerHTML = "如果你在未攻击的时候被攻击,此次攻击无效并2倍反弹给敌人";
        }
        if (selectSkill.value == "HLXM") {
            skillDesc.innerHTML = "如果你的攻击的两倍伤害能够击杀敌人,则本次攻击造成两倍伤害";
        }
        if (selectSkill.value == "Jingyan") {
            skillDesc.innerHTML = "战斗获得的经验增加20%";
        }
        if (selectSkill.value == "Baoji") {
            skillDesc.innerHTML = "提升70%暴击伤害,降低40%攻击";
        }
        if (selectSkill.value == "Gongji") {
            skillDesc.innerHTML = "提升30%攻击,降低100%暴击伤害";
        }
        if (selectSkill.value == "Kuangbao") {
            skillDesc.innerHTML = "血量位于50%以下获得狂暴,增加50%攻速和50%伤害";
        }
        if (selectSkill.value == "JiyuanXiaoguo") {
            skillDesc.innerHTML = "基础护体降低50%,提高30%汲元效果";
        }
        if (selectSkill.value == "Shanbi") {
            skillDesc.innerHTML = "有30%概率闪避敌方攻击,闪避时有40%的概率能反击敌人造成50%原本受到的伤害";
        }
        if (selectSkill.value == "Xuanyun") {
            skillDesc.innerHTML = "攻击时有15%眩晕敌人,每次眩晕降低敌人5%攻击";
        }
        if (selectSkill.value == "Gaoping") {
            skillDesc.innerHTML = "提高高品质装备出现的概率,暴击率提升30%,但是基础气血下降50%";
        }
        if (selectSkill.value == "Neigui") {
            skillDesc.innerHTML = "受到攻击时10%几率让敌人也受到一样的伤害";
        }
        if (selectSkill.value == "Yinxue") {
            skillDesc.innerHTML = "基础攻速增加100%,提高100%汲元效果,降低90%初始攻击";
        }
        if (selectSkill.value == "Huichun") {
            skillDesc.innerHTML = "每次攻击回复2%气血";
        }
        if (selectSkill.value == "QixueHun") {
            skillDesc.innerHTML = "气血低于70%后,每1%损失气血提高2%伤害";
        }
        if (selectSkill.value == "Jingfan") {
            skillDesc.innerHTML = "气血低于30%后,让敌人受到自己受到的所有伤害";
        }
        if (selectSkill.value == "Daotian") {
            skillDesc.innerHTML = "每次攻击5%几率提高伤害1%的气血上限";
        }
        if (selectSkill.value == "Luantian") {
            skillDesc.innerHTML = "每次攻击5%几率提高0.1%暴击几率";
        }
        if (selectSkill.value == "Baitian") {
            skillDesc.innerHTML = "每次攻击5%几率提高伤害1%的护体";
        }
        if (selectSkill.value == "Lutian") {
            skillDesc.innerHTML = "每次攻击5%几率提高伤害0.5%的攻击";
        }
        if (selectSkill.value == "Zhutian") {
            skillDesc.innerHTML = "每次攻击5%几率提高0.5%暴击伤害";
        }
        if (selectSkill.value == "Daitian") {
            skillDesc.innerHTML = "每次攻击1%几率使对手受到他100%血量的伤害";
        }
        if (selectSkill.value == "TXWW") {
            skillDesc.innerHTML = "每次攻击10%几率进入一种姿态。【玄】:造成的伤害和受到的伤害X2【止】:受到的伤害-30%【动】:连续造成3次伤害,攻击后退出姿态。战斗后重置。";
        }
    }

    // Operation Buttons
    let confirm = document.querySelector("#allocate-confirm");
    let reset = document.querySelector("#allocate-reset");
    let close = document.querySelector("#allocate-close");
    confirm.onclick = function () {
        // Set allocated stats to player base stats
        player.baseStats = {
            hp: stats.hp,
            atk: stats.atk,
            def: stats.def,
            pen: 0,
            atkSpd: stats.atkSpd,
            vamp: 0,
            critRate: 0,
            critDmg: 50
        }

        // Set player skill
        objectValidation();
        if (selectSkill.value == "Remnant Razor") {
            player.skills.push("Remnant Razor");
        }
        if (selectSkill.value == "Titan's Will") {
            player.skills.push("Titan's Will");
        }
        if (selectSkill.value == "Devastator") {
            player.skills.push("Devastator");
            player.baseStats.atkSpd = player.baseStats.atkSpd - ((30 * player.baseStats.atkSpd) / 100);
        }
        if (selectSkill.value == "Rampager") {
            player.skills.push("Rampager");
        }
        if (selectSkill.value == "Blade Dance") {
            player.skills.push("Blade Dance");
        }
        if (selectSkill.value == "Paladin's Heart") {
            player.skills.push("Paladin's Heart");
        }
        if (selectSkill.value == "Aegis Thorns") {
            player.skills.push("Aegis Thorns");
        }
        if (selectSkill.value == "Kuaiqidong") {
            player.skills.push("Kuaiqidong");
            player.baseStats.atkSpd = player.baseStats.atkSpd + ((100 * player.baseStats.atkSpd) / 100);
        }
        if (selectSkill.value == "Lingshi") {
            player.skills.push("Lingshi");
        }
        
        if (selectSkill.value == "GoldG") {
            player.skills.push("GoldG");
        }
        if (selectSkill.value == "GoldS") {
            player.skills.push("GoldS");
        }
        if (selectSkill.value == "PoorG") {
            player.skills.push("PoorG");
        }
        if (selectSkill.value == "PoorS") {
            player.skills.push("PoorS");
        }
        if (selectSkill.value == "ZDKJ") {
            player.skills.push("ZDKJ");
        }
        if (selectSkill.value == "ZGQX") {
            player.skills.push("ZGQX");
        }
        if (selectSkill.value == "YJSH") {
            player.baseStats.hp = player.baseStats.hp - ((99 * player.baseStats.atkSpd) / 100);
            player.skills.push("YJSH");
        }
        if (selectSkill.value == "HL") {
            player.skills.push("HL");
        }
        if (selectSkill.value == "DCJJ") {
            player.skills.push("DCJJ");
        }
        if (selectSkill.value == "XLZL") {
            player.skills.push("XLZL");
        }
        if (selectSkill.value == "BQZJ") {
            player.skills.push("BQZJ");
        }
        if (selectSkill.value == "BQZD") {
            player.skills.push("BQZD");
        }
        if (selectSkill.value == "TRA") {
            player.skills.push("TRA");
        }
        if (selectSkill.value == "GDJSS") {
            player.skills.push("GDJSS");
        }
        if (selectSkill.value == "XBS") {
            player.skills.push("XBS");
        }
        if (selectSkill.value == "YJMY") {
            player.skills.push("YJMY");
        }
        if (selectSkill.value == "RCZF") {
            player.skills.push("RCZF");
        }
        if (selectSkill.value == "DPMJ") {
            player.skills.push("DPMJ");
        }
        if (selectSkill.value == "CZJS") {
            player.skills.push("DPMJ");
        }
        if (selectSkill.value == "FX") {
            player.skills.push("FX");
        }
        if (selectSkill.value == "ZJJ") {
            player.skills.push("ZJJ");
        }
        if (selectSkill.value == "ZSDS") {
            player.skills.push("ZSDS");
        }
        if (selectSkill.value == "HLXM") {
            player.skills.push("HLXM");
        }

        if(player.yuj==1){
            if (selectSkill.value == "Jingyan") {
                player.skills.push("Jingyan");
            }
            if (selectSkill.value == "Baoji") {
                player.skills.push("Baoji");
            }
            if (selectSkill.value == "Gongji") {
                player.skills.push("Gongji");
            }
            if (selectSkill.value == "Kuangbao") {
                player.skills.push("Kuangbao");
            }
            if (selectSkill.value == "JiyuanXiaoguo") {
                player.skills.push("JiyuanXiaoguo");
                player.baseStats.def = player.baseStats.def - ((50 * player.baseStats.def) / 100);
            }
            if (selectSkill.value == "Shanbi") {
                player.skills.push("Shanbi");
            }
            if (selectSkill.value == "Xuanyun") {
                player.skills.push("Xuanyun");
            }
            if (selectSkill.value == "Gaoping") {
                player.skills.push("Gaoping");
                player.baseStats.hp = player.baseStats.hp - ((50 * player.baseStats.hp) / 100);
                player.baseStats.critRate = player.baseStats.critRate +30;
            }
            if (selectSkill.value == "Neigui") {
                player.skills.push("Neigui");
            }
            if (selectSkill.value == "Yinxue") {
                player.skills.push("Yinxue");
                player.baseStats.atkSpd = player.baseStats.atkSpd + ((100 * player.baseStats.atkSpd) / 100);
                player.baseStats.atk = player.baseStats.atk - ((90 * player.baseStats.atk) / 100);
            }
            if (selectSkill.value == "Huichun") {
                player.skills.push("Huichun");
            }
            if (selectSkill.value == "QixueHun") {
                player.skills.push("QixueHun");
            }
            if (selectSkill.value == "Daotian") {
                player.skills.push("Daotian");
            }
            if (selectSkill.value == "Jingfan") {
                player.skills.push("Jingfan");
            }
            if (selectSkill.value == "Luantian") {
                player.skills.push("Luantian");
            }
            if (selectSkill.value == "Baitian") {
                player.skills.push("Baitian");
            }
            if (selectSkill.value == "Lutian") {
                player.skills.push("Lutian");
            }
            if (selectSkill.value == "Zhutian") {
                player.skills.push("Zhutian");
            }
            if (selectSkill.value == "Daitian") {
                player.skills.push("Daitian");
            }
            if (selectSkill.value == "TXWW") {
                player.skills.push("TXWW");
            }
        }else{
            let sss = 0;
            if (selectSkill.value == "Jingyan") {
                sss=1;
            }
            if (selectSkill.value == "Baoji") {
                sss=1;
            }
            if (selectSkill.value == "Gongji") {
                sss=1;
            }
            if (selectSkill.value == "Kuangbao") {
                sss=1;
            }
            if (selectSkill.value == "JiyuanXiaoguo") {
                sss=1;
            }
            if (selectSkill.value == "Shanbi") {
                sss=1;
            }
            if (selectSkill.value == "Xuanyun") {
                sss=1;
            }
            if (selectSkill.value == "Gaoping") {
                sss=1;
            }
            if (selectSkill.value == "Neigui") {
                sss=1;
            }
            if (selectSkill.value == "Yinxue") {
                sss=1;
            }
            if (selectSkill.value == "Huichun") {
                sss=1;
            }
            if (selectSkill.value == "QixueHun") {
                sss=1;
            }
            if (selectSkill.value == "Daotian") {
                sss=1;
            }
            if (selectSkill.value == "Jingfan") {
                sss=1;
            }
            if (selectSkill.value == "Luantian") {
                sss=1;
            }
            if (selectSkill.value == "Baitian") {
                sss=1;
            }
            if (selectSkill.value == "Lutian") {
                sss=1;
            }
            if (selectSkill.value == "Zhutian") {
                sss=1;
            }
            if (selectSkill.value == "Daitian") {
                sss=1;
            }
            if (selectSkill.value == "TXWW") {
                sss=1;
            }
            if(sss==1){
                alert('未拥有【先天包】,先天已自动替换成【琉璃剑体】。【先天包】可在【爱发电】获取。重置了一下,已购买的请重新输入')
                player.skills.push("Remnant Razor");
            }
        }

        if(player.vip>=1){
            player.baseStats.hp = 0;
        }

        // Proceed to dungeon
        player.allocated = true;
        enterDungeon();
        player.stats.hp = player.stats.hpMax;
        playerLoadStats();
        defaultModalElement.style.display = "none";
        defaultModalElement.innerHTML = "";
        document.querySelector("#title-screen").style.filter = "brightness(100%)";
    }
    reset.onclick = function () {
        sfxDecline.play();
        allocation = {
            hp: 5,
            atk: 5,
            def: 5,
            atkSpd: 5
        };
        points = 20;
        if(player.iop==1){
            points = 50
        }
        updateStats();

        // Display Reset
        document.querySelector(`#hpDisplay`).innerHTML = `气血: ${stats.hp}`;
        document.querySelector(`#atkDisplay`).innerHTML = `攻击: ${stats.atk}`;
        document.querySelector(`#defDisplay`).innerHTML = `护体: ${stats.def}`;
        document.querySelector(`#atkSpdDisplay`).innerHTML = `攻速: ${stats.atkSpd}`;
        document.querySelector(`#hpAllo`).innerHTML = allocation.hp;
        document.querySelector(`#atkAllo`).innerHTML = allocation.atk;
        document.querySelector(`#defAllo`).innerHTML = allocation.def;
        document.querySelector(`#atkSpdAllo`).innerHTML = allocation.atkSpd;
        document.querySelector(`#alloPts`).innerHTML = `可分配属性点: ${points}`;
    }
    close.onclick = function () {
        sfxDecline.play();
        defaultModalElement.style.display = "none";
        defaultModalElement.innerHTML = "";
        document.querySelector("#title-screen").style.filter = "brightness(100%)";
    }
}

const objectValidation = () => {
    if (player.skills == undefined) {
        player.skills = [];
    }
    if (player.tempStats == undefined) {
        player.tempStats = {};
        player.tempStats.atk = 0;
        player.tempStats.atkSpd = 0;
        player.tempStats.firstAtk = 0;
        player.tempStats.firstDef = 0;
        player.tempStats.czjs = 0;
        player.tempStats.zjj = 0;
        player.tempStats.zsds = 0;
        player.tempStats.txww = 0;
    }
    saveData();
}
