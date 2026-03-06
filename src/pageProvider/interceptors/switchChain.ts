import IconRabby from "../../assets/rabby.svg";
import notice from "../notice";
import { escapeHTML } from "../utils";
import { isInSameOriginIframe } from "../../utils/iframe";

let instance: ReturnType<typeof notice> | null;

interface Chain {
  [key: string]: any;
  id: number;
  name: string;
  logo?: string;
  isTestnet: boolean;
}

export const switchChainNotice = (
  chain: Chain & {
    prev?: Chain;
  }
) => {
  if (isInSameOriginIframe()) {
    return;
  }
  if (instance) {
    instance.hide();
    instance = null;
  }

  const safeChainName = escapeHTML(chain?.name);

  const rawContent = `<img style="width: 20px; height: 20px; margin-right: 8px; margin-bottom:0px;" src="${IconRabby}"/> <div style="color: #192945; padding-right: 2px;">Network switched to <span class="rabby-strong" style="margin: 0;">${safeChainName}</span></div>`;
  let content = rawContent;

  instance = notice({
    timeout: 3000,
    content,
  });
};
