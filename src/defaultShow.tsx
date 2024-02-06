import { Action, ActionPanel, Detail, Icon, List, showToast, Toast } from "@raycast/api";
import { useCachedState } from "@raycast/utils";

import mappings from "./components/showMetadata/mappings";
import IShows from "./interfaces/shows";
import HTTPRequest from "./utils/request";

export default function DefaultShowCommand() {
  const [defaultShow, setDefaultShow] = useCachedState<string | undefined>("default-show", undefined);
  const [defaultShowTitle, setDefaultShowTitle] = useCachedState<string | undefined>("default-show", undefined);

  const { data, isLoading, error } = HTTPRequest({
    url: "/shows",
  }) as {
    data: IShows | undefined;
    isLoading: boolean;
    error: { title: string; message: string; markdown: string } | undefined;
  };

  const showData = data?.data;

  if (showData) {
    return (
      <List isLoading={!defaultShow || !defaultShowTitle || isLoading}>
        {showData &&
          !isLoading &&
          showData.map((show) => {
            return (
              <List.Item
                key={show.attributes.slug}
                icon={mappings.imageUrl(show).value || Icon.Bolt}
                title={mappings.title(show).value!}
                subtitle={mappings.description(show).value}
                accessories={[{ text: mappings.author(show).value }, { icon: Icon.PersonCircle }]}
                actions={
                  <ActionPanel>
                    <Action
                      title="Set Default for Menu Bar"
                      onAction={() => {
                        setDefaultShow(show.attributes.slug);
                        setDefaultShowTitle(mappings.title(show).value);
                      }}
                    />
                  </ActionPanel>
                }
              ></List.Item>
            );
          })}
      </List>
    );
  } else if (error) {
    showToast({
      style: Toast.Style.Failure,
      title: error.title,
      message: error.message,
    });

    return <Detail markdown={error.markdown} />;
  }
}
