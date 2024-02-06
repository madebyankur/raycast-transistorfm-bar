import { useEffect, useState } from "react";

import { Icon, MenuBarExtra, open, showHUD } from "@raycast/api";

import IAnalytics from "./interfaces/analytics";
import IShows from "./interfaces/shows";
import HTTPRequest from "./utils/request";

export default function Command() {
  const [defaultShow, setDefaultShow] = useState<string | undefined>();

  const { data, isLoading, error } = HTTPRequest({
    url: "/shows",
  }) as {
    data: IShows | undefined;
    isLoading: boolean;
    error: { title: string; message: string; markdown: string } | undefined;
  };

  if (!data) {
    return <MenuBarExtra isLoading={isLoading} />;
  }

  useEffect(() => {
    setDefaultShow(data.data.pop()?.attributes.slug);
  }, [data, isLoading]);

  const { data: analyticsData, isLoading: analyticsIsLoading } = HTTPRequest({
    url: `/analytics/${defaultShow}`,
  }) as {
    data: IAnalytics | undefined;
    isLoading: boolean;
    error: { title: string; message: string; markdown: string } | undefined;
  };

  if (!analyticsData) {
    return <MenuBarExtra isLoading={isLoading} />;
  }

  const downloads = analyticsData?.data.attributes.downloads.pop()!.downloads.toLocaleString();

  if (analyticsData) {
    return (
      <MenuBarExtra icon={Icon.Download} isLoading={isLoading && analyticsIsLoading} title={downloads}>
        <MenuBarExtra.Item
          title="Open TransistorFM Dashboard"
          onAction={() => open(`https://dashboard.transistor.fm/shows/${defaultShow}`)}
        />

        <MenuBarExtra.Separator />

        <MenuBarExtra.Item
          title="Episodes"
          onAction={() => open(`https://dashboard.transistor.fm/shows/${defaultShow}/episodes`)}
        />

        <MenuBarExtra.Item
          title="Distribution"
          onAction={() => open(`https://dashboard.transistor.fm/shows/${defaultShow}/distribution`)}
        />

        <MenuBarExtra.Item
          title="Analytics"
          onAction={() => open(`https://dashboard.transistor.fm/shows/${defaultShow}/analytics`)}
        />
      </MenuBarExtra>
    );
  } else if (error) {
    showHUD(error.message);
  }
}
