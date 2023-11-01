import { Game } from "../../pages/Game";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SocketProvider } from "../../game/contexts/SocketContext";
import axios from "axios";
import { GameRoute } from "./GameRoute";
import { Route, Routes, useNavigate } from "react-router-dom";
// import useNavigate
interface customParam
{
  user_id : number;
  OpponnentId : number,
  gameDuration: string;
}

export const GameSetup  = ( ) =>
{

  let customParam : customParam;
  const {state} = useLocation();
  const navigate = useNavigate();
  
  if (state === null) {
    navigate('/error');
    return null;
  }
    // console.log('navigate');
  // }
  // else
  // {
    console.log('userID = ', state);
        customParam =
        {
            gameDuration : state.gameDuration,
            user_id : state.user_id,
            OpponnentId : state.OpponnentId
        };
  // }
  return (
    <>
    <SocketProvider customParam={customParam}>
      <Game />
    <GameRoute/>
    </SocketProvider>
    </>
  );
}