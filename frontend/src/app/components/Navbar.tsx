"use client";
import React, { useEffect, useRef } from "react";
// store
import { useAppStore } from "../store";
// styles
import { Logo, MainNav } from "../styles/Navbar.styles";

const Navbar = () => {
  const { setNavbarHeightState } = useAppStore();
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeightState(`${navbarRef.current.clientHeight}px`);
    }
  }, [navbarRef.current]);
  return (
    <MainNav ref={navbarRef}>
      <Logo>text video</Logo>
    </MainNav>
  );
};

export default Navbar;
